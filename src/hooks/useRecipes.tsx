
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

      const { data, error } = await supabase
        .from('user_recipes')
        .insert({
          ...recipe,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['public-recipes'] });
    },
  });
};
