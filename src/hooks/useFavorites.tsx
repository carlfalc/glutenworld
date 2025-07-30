
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserFavorite {
  id: string;
  user_id: string;
  type: 'recipe' | 'product' | 'business';
  recipe_id?: string;
  product_name?: string;
  product_description?: string;
  product_image_url?: string;
  product_category?: string;
  product_scanned_at?: string;
  product_analysis?: string;
  safety_rating?: string;
  allergen_warnings?: string[];
  gluten_status?: string;
  dairy_status?: string;
  vegan_status?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  business_website?: string;
  business_rating?: number;
  business_price_level?: number;
  business_types?: string[];
  business_category?: string;
  business_photo_reference?: string;
  business_latitude?: number;
  business_longitude?: number;
  business_opening_hours?: any;
  business_google_maps_url?: string;
  created_at: string;
  updated_at: string;
}

export const useFavorites = (type?: 'recipe' | 'product' | 'business') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id, type],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    retry: false, // Don't retry auth errors
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (favorite: Omit<UserFavorite, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          ...favorite,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Added to Favorites",
        description: "Item has been added to your favorites.",
      });
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Removed from Favorites",
        description: "Item has been removed from your favorites.",
      });
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useIsFavorite = (type: 'recipe' | 'product' | 'business', identifier: { productName?: string; itemId?: string; businessName?: string }) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-favorite', user?.id, type, identifier.productName, identifier.itemId, identifier.businessName],
    queryFn: async () => {
      if (!user) return false;
      
      let query = supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type);

      if (type === 'recipe' && identifier.itemId) {
        query = query.eq('recipe_id', identifier.itemId);
      } else if (type === 'product' && identifier.productName) {
        query = query.eq('product_name', identifier.productName);
      } else if (type === 'business' && identifier.businessName) {
        query = query.eq('business_name', identifier.businessName);
      } else {
        return false;
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && ((type === 'recipe' && !!identifier.itemId) || (type === 'product' && !!identifier.productName) || (type === 'business' && !!identifier.businessName)),
    retry: false, // Don't retry auth errors
  });
};
