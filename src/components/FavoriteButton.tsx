
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/useFavorites';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  type: 'recipe' | 'product';
  itemId?: string;
  productName?: string;
  productDescription?: string;
  productImageUrl?: string;
  productCategory?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const FavoriteButton = ({ 
  type, 
  itemId, 
  productName, 
  productDescription,
  productImageUrl,
  productCategory,
  className = "",
  size = "sm" 
}: FavoriteButtonProps) => {
  const { data: isFavorite } = useIsFavorite(type, { itemId, productName });
  const { data: favorites = [] } = useFavorites(type);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const handleToggleFavorite = () => {
    if (isFavorite) {
      // Find the favorite to remove
      const favoriteToRemove = favorites.find(fav => {
        if (type === 'recipe') {
          return fav.recipe_id === itemId;
        } else {
          return fav.product_name === productName;
        }
      });
      
      if (favoriteToRemove) {
        removeFromFavorites.mutate(favoriteToRemove.id);
      }
    } else {
      // Add to favorites
      if (type === 'recipe' && itemId) {
        addToFavorites.mutate({
          type: 'recipe',
          recipe_id: itemId,
        });
      } else if (type === 'product' && productName) {
        addToFavorites.mutate({
          type: 'product',
          product_name: productName,
          product_description: productDescription,
          product_image_url: productImageUrl,
          product_category: productCategory,
          product_scanned_at: new Date().toISOString(),
        });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleFavorite}
      className={`p-2 ${className}`}
      disabled={addToFavorites.isPending || removeFromFavorites.isPending}
    >
      <Heart 
        className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
