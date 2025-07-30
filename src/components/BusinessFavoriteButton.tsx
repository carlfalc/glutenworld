import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/useFavorites';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

interface Store {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  types: string[];
  category: string;
  website?: string;
  photoReference?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  openingHours?: {
    open_now?: boolean;
  };
  googleMapsUrl?: string;
}

interface BusinessFavoriteButtonProps {
  store: Store;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const BusinessFavoriteButton = ({ 
  store, 
  className = "",
  size = "sm" 
}: BusinessFavoriteButtonProps) => {
  const { user } = useAuth();
  const { data: isFavorite } = useIsFavorite('business', { businessName: store.name });
  const { data: favorites = [] } = useFavorites('business');
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const handleToggleFavorite = () => {
    // Handle unauthenticated users gracefully
    if (!user) {
      return;
    }
    if (isFavorite) {
      // Find the favorite to remove
      const favoriteToRemove = favorites.find(fav => 
        fav.business_name === store.name
      );
      
      if (favoriteToRemove) {
        removeFromFavorites.mutate(favoriteToRemove.id);
      }
    } else {
      // Add to favorites
      addToFavorites.mutate({
        type: 'business',
        business_name: store.name,
        business_address: store.address,
        business_rating: store.rating,
        business_price_level: store.priceLevel,
        business_types: store.types,
        business_category: store.category,
        business_website: store.website,
        business_photo_reference: store.photoReference,
        business_latitude: store.geometry.location.lat,
        business_longitude: store.geometry.location.lng,
        business_opening_hours: store.openingHours,
        business_google_maps_url: store.googleMapsUrl,
      });
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

export default BusinessFavoriteButton;