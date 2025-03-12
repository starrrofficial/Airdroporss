import { Share2, TwitterIcon, MessageCircle, LinkedinIcon, MessageSquareMore } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
}

export default function ShareButton({ title, description, url }: ShareButtonProps) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title}:\n${description}`)}&url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${title}:\n${description}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    discord: `https://discord.com/channels/@me?message=${encodeURIComponent(`Check out ${title}:\n${description}\n${url}`)}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-primary/20 hover:bg-primary/30"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(shareUrls.twitter, '_blank')}>
          <TwitterIcon className="mr-2 h-4 w-4 text-blue-400" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareUrls.telegram, '_blank')}>
          <MessageCircle className="mr-2 h-4 w-4 text-blue-500" />
          Share on Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareUrls.linkedin, '_blank')}>
          <LinkedinIcon className="mr-2 h-4 w-4 text-blue-600" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareUrls.discord, '_blank')}>
          <MessageSquareMore className="mr-2 h-4 w-4 text-indigo-500" />
          Share on Discord
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}