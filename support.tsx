import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Youtube, Coffee, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const walletAddress = "TSmwcK5UYd6cHdMvSqmEZcjW3wR12wMe37";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Address Copied!",
      description: "Wallet address has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Support Us</h1>
          <p className="text-sm text-muted-foreground">
            Join our community and help us grow
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <Card className="overflow-hidden bg-black/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-pink-500 p-3 rounded-lg bg-white/10">
                <Instagram size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Follow us on Instagram</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with the latest crypto trends
                </p>
              </div>
              <Button variant="outline" onClick={() => window.open('#', '_blank')}>
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-black/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-blue-500 p-3 rounded-lg bg-white/10">
                <Twitter size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Join us on X</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time updates and news
                </p>
              </div>
              <Button variant="outline" onClick={() => window.open('#', '_blank')}>
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-black/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-red-500 p-3 rounded-lg bg-white/10">
                <Youtube size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Subscribe on YouTube</h3>
                <p className="text-sm text-muted-foreground">
                  Watch our educational content
                </p>
              </div>
              <Button variant="outline" onClick={() => window.open('#', '_blank')}>
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-black/50">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="text-amber-500 p-3 rounded-lg bg-white/10">
                  <Coffee size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Buy us a Coffee</h3>
                  <p className="text-sm text-muted-foreground">
                    Support our development
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Network:</span> TRX
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Currency:</span> USDT
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted/20 p-2 rounded text-sm font-mono overflow-hidden overflow-ellipsis">
                    {walletAddress}
                  </div>
                  <Button size="icon" variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
