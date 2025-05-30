
import { useState } from 'react';
import { Share, Facebook, Twitter, Mail, Link2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ShareRecipeProps {
  recipe: string;
  title?: string;
}

const ShareRecipe = ({ recipe, title = "Check out this gluten-free recipe!" }: ShareRecipeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `${title}\n\n${recipe.substring(0, 200)}...`;

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Recipe copied to clipboard. You can now paste it on Instagram.",
        });
        setIsOpen(false);
        return;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case 'link':
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Recipe link copied to clipboard.",
        });
        setIsOpen(false);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
        >
          <Share className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </Button>
          <Button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500"
          >
            <Twitter className="w-4 h-4" />
            X (Twitter)
          </Button>
          <Button
            onClick={() => handleShare('instagram')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </Button>
          <Button
            onClick={() => handleShare('email')}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button
            onClick={() => handleShare('link')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 col-span-2"
          >
            <Link2 className="w-4 h-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareRecipe;
