import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export const useUserRecipeRating = (recipeId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-recipe-rating', recipeId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!recipeId,
  });
};

export const useRateRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ recipeId, rating }: { recipeId: string; rating: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('recipe_ratings')
        .upsert({
          user_id: user.id,
          recipe_id: recipeId,
          rating,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-recipe-rating', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['public-recipes'] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });
};