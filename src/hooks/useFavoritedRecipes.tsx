import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Recipe } from '@/hooks/useRecipes';

export interface FavoritedRecipe extends Recipe {
  favorite_id: string;
}

export const useFavoritedRecipes = () => {
  const { user } = useAuth();
  const { data: favorites = [] } = useFavorites('recipe');
  
  return useQuery({
    queryKey: ['favorited-recipes', user?.id, favorites],
    queryFn: async () => {
      if (!user || favorites.length === 0) return [];
      
      const recipeIds = favorites
        .filter(fav => fav.recipe_id)
        .map(fav => fav.recipe_id);
      
      if (recipeIds.length === 0) return [];
      
      const { data: recipes, error } = await supabase
        .from('user_recipes')
        .select('*')
        .in('id', recipeIds);
      
      if (error) throw error;
      
      // Combine favorite info with recipe data
      return recipes.map(recipe => {
        const favorite = favorites.find(f => f.recipe_id === recipe.id);
        return {
          ...recipe,
          favorite_id: favorite?.id || '',
        };
      });
    },
    enabled: !!user && favorites.length > 0,
  });
};