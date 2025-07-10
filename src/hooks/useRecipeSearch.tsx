import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseRecipe {
  id: string;
  title: string;
  original_recipe?: string;
  converted_recipe?: string;
  ingredients: any;
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: string;
  cuisine_type?: string;
  is_public: boolean;
  calories_per_serving?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  cholesterol_mg?: number;
  image_url?: string;
  likes_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  maxPrepTime?: number;
  maxCalories?: number;
  cuisine?: string;
  dietary?: string[];
}

export interface SearchResult {
  recipes: DatabaseRecipe[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const useRecipeSearch = () => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const { toast } = useToast();

  const searchRecipes = useCallback(async (
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 12
  ) => {
    setLoading(true);
    
    try {
      let queryBuilder = supabase
        .from('recipes')
        .select('*', { count: 'exact' })
        .eq('is_public', true);

      // Text search across title and converted_recipe
      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,converted_recipe.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters.difficulty) {
        queryBuilder = queryBuilder.eq('difficulty_level', filters.difficulty);
      }
      
      if (filters.maxPrepTime) {
        queryBuilder = queryBuilder.lte('prep_time', filters.maxPrepTime);
      }
      
      if (filters.maxCalories) {
        queryBuilder = queryBuilder.lte('calories_per_serving', filters.maxCalories);
      }
      
      if (filters.cuisine) {
        queryBuilder = queryBuilder.eq('cuisine_type', filters.cuisine);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      queryBuilder = queryBuilder
        .range(from, to)
        .order('created_at', { ascending: false });

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search recipes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / pageSize);

      setSearchResult({
        recipes: data || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const populateDatabase = useCallback(async () => {
    try {
      const response = await fetch(`https://hfuyqkcbpkrcragnyTDV.supabase.co/functions/v1/populate-recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXlxa2NicGtyY3JhZ255dGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTUzODcsImV4cCI6MjA2NDEzMTM4N30.HPvTNWts0sVj3FD5WpvbASuLKbCYZNGzO29vzAC8XWQ`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to populate database');
      }

      const result = await response.json();
      toast({
        title: "Database Updated",
        description: result.message,
      });

      return result;
    } catch (error) {
      console.error('Error populating database:', error);
      toast({
        title: "Database Error",
        description: "Failed to populate database with recipes.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    searchRecipes,
    populateDatabase,
    searchResult,
    loading
  };
};