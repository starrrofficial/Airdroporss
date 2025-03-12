import { type User, type InsertUser, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log("Creating user:", insertUser.username);
      const [user] = await db.insert(users).values(insertUser).returning();
      console.log("User created successfully:", user.id);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      console.log("Fetching user by ID:", id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by username:", username);
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by email:", email);
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();