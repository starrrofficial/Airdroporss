import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";
import { storage } from "./storage";
import type { InsertAirdrop } from "@shared/schema";
import { log } from "./vite";

export class AirdropScraper {
  private isRunning = false;
  private baseUrl = "https://airdrops.io";

  private async scrapeSection(url: string): Promise<InsertAirdrop[]> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const airdrops: InsertAirdrop[] = [];

      // Each airdrop item is in a list item with class 'wp-block-post'
      $("li.wp-block-post").each((_, element) => {
        const $el = $(element);

        // Extract all required information
        const name = $el.find(".wp-block-post-title").text().trim();
        const description = $el.find(".wp-block-post-excerpt__excerpt").text().trim();
        const reward = $el.find(".airdrop-reward").text().trim() || "n/a";
        const platform = $el.find(".airdrop-network").text().trim().toLowerCase() || "eth";
        const totalValue = $el.find(".airdrop-value").text().trim() || "n/a";
        const joinLink = $el.find(".wp-block-post-title a").attr("href") || "#";

        // Get the logo image
        const logo = $el.find(".wp-block-post-featured-image img").attr("src") || 
                    "https://via.placeholder.com/150";

        // Set a default deadline 3 months from now
        const deadline = new Date();
        deadline.setMonth(deadline.getMonth() + 3);

        // Only add if we have the minimum required fields
        if (name && description) {
          airdrops.push({
            name,
            description,
            reward,
            logo,
            deadline,
            platform,
            totalValue,
            isFeatured: false,
            joinLink,
            status: this.determineStatus(url),
            steps: [
              "Connect your Web3 wallet",
              "Complete required social tasks",
              "Verify eligibility",
              "Submit wallet address",
              "Wait for token distribution"
            ],
          });
        }
      });

      return airdrops;
    } catch (error) {
      log(`Error scraping section ${url}: ${error}`, "scraper");
      return [];
    }
  }

  private determineStatus(url: string): string {
    if (url.includes("/latest")) return "unconfirmed";
    if (url.includes("/category/confirmed-airdrops")) return "confirmed";
    return "unconfirmed";
  }

  async scrapeAirdrops() {
    if (this.isRunning) {
      log("Scraper is already running", "scraper");
      return;
    }

    try {
      this.isRunning = true;
      log("Starting airdrop scrape", "scraper");

      // Scrape different sections
      const sections = [
        { url: `${this.baseUrl}`, isFeatured: true }, // Latest on homepage
        { url: `${this.baseUrl}/category/confirmed-airdrops`, isFeatured: false },
        { url: `${this.baseUrl}/category/upcoming-airdrops`, isFeatured: false },
      ];

      for (const section of sections) {
        try {
          const airdrops = await this.scrapeSection(section.url);

          // Mark latest airdrops as featured
          if (section.isFeatured) {
            airdrops.forEach(airdrop => {
              airdrop.isFeatured = true;
            });
          }

          // Add new airdrops to storage
          for (const airdrop of airdrops) {
            await storage.createAirdrop(airdrop);
          }

          log(`Successfully scraped ${airdrops.length} airdrops from ${section.url}`, "scraper");
        } catch (error) {
          log(`Error processing section ${section.url}: ${error}`, "scraper");
          continue; // Continue with next section even if one fails
        }
      }
    } catch (error) {
      log(`Error during scraping: ${error}`, "scraper");
    } finally {
      this.isRunning = false;
    }
  }

  startScheduledScraping(cronSchedule = "*/30 * * * *") { // Default: every 30 minutes
    cron.schedule(cronSchedule, () => {
      this.scrapeAirdrops();
    });

    // Run initial scrape
    this.scrapeAirdrops();

    log(`Scheduled scraping started with schedule: ${cronSchedule}`, "scraper");
  }
}

export const airdropScraper = new AirdropScraper();