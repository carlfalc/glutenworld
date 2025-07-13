import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAIGeneratorAccess } from '@/hooks/useAIGeneratorAccess';

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
  const { hasAccess } = useAIGeneratorAccess();

  const searchRecipes = useCallback(async (
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 12
  ) => {
    console.log('🔍 Starting search with:', { query, filters, page, pageSize });
    setLoading(true);
    
    try {
      // Check if user has access to premium recipes
      if (!hasAccess) {
        console.log('🔍 User does not have access to premium recipes');
        setSearchResult({
          recipes: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0
        });
        setLoading(false);
        return;
      }

      console.log('🔍 Building query for recipes table...');
      let queryBuilder = supabase
        .from('recipes')
        .select('*', { count: 'exact' })
        .eq('is_public', true);
      console.log('🔍 Base query built successfully');

      // Handle different search scenarios
      if (query.trim()) {
        // Text search - search in title and recipe content
        console.log('🔍 Applying text search for:', query);
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,converted_recipe.ilike.%${query}%,original_recipe.ilike.%${query}%`
        );
      } else if (filters.category && filters.category !== 'all') {
        // Category filter based on cuisine_type
        console.log('🔍 Applying category filter only:', filters.category);
        // Capitalize first letter to match database format
        const categoryName = filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
        queryBuilder = queryBuilder.eq('cuisine_type', categoryName);
      }
      // If no query and no category filter, just get all recipes (no additional WHERE clause)
      
      // Apply other filters
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

      console.log('🔍 Executing query...');
      const result = await queryBuilder;
      const { data, error, count } = result;
      
      console.log('🔍 Query completed');
      console.log('🔍 Raw result:', result);
      console.log('🔍 Search results:', { 
        dataLength: data?.length, 
        error: error?.message || error, 
        count,
        sampleTitles: data?.slice(0, 3).map(r => r.title) // Show first 3 titles for debugging
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search recipes. Please try again.",
          variant: "destructive",
        });
        setSearchResult({
          recipes: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0
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
      setSearchResult({
        recipes: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, [toast, hasAccess]); // Add hasAccess dependency

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