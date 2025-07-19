
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Recipe {
  id: string;
  title: string;
  original_recipe?: string;
  converted_recipe?: string;
  ingredients?: any;
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: 'Easy' | 'Medium' | 'Hard';
  cuisine_type?: string;
  is_public?: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  calories_per_serving?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  cholesterol_mg?: number;
  image_url?: string;
  average_rating?: number;
  rating_count?: number;
  conversion_count?: number;
  last_converted_at?: string;
}

export const useRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recipes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const usePublicRecipes = () => {
  return useQuery({
    queryKey: ['public-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (recipe: Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      // First, insert into user_recipes
      const { data: userRecipe, error: userRecipeError } = await supabase
        .from('user_recipes')
        .insert({
          ...recipe,
          user_id: user.id,
        })
        .select()
        .single();

      if (userRecipeError) throw userRecipeError;

      // If recipe is gluten-free, also add to main recipes database for all users
      const isGlutenFree = recipe.title?.toLowerCase().includes('gluten free') || 
                          recipe.title?.toLowerCase().includes('gluten-free') ||
                          recipe.converted_recipe?.toLowerCase().includes('gluten free') ||
                          recipe.converted_recipe?.toLowerCase().includes('gluten-free');

      if (isGlutenFree) {
        const { error: publicRecipeError } = await supabase
          .from('recipes')
          .insert({
            ...recipe,
            user_id: null, // Public recipe
            is_public: true,
          });

        // Don't throw error if public insertion fails, just log it
        if (publicRecipeError) {
          console.warn('Failed to add gluten-free recipe to public database:', publicRecipeError);
        }
      }

      return userRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['public-recipes'] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

// Hook to get most converted recipes (hotlist)
export const useMostConvertedRecipes = () => {
  return useQuery({
    queryKey: ['most-converted-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_most_converted_recipes', { limit_count: 10 });
      if (error) throw error;
      return data as Recipe[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
