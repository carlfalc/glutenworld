
-- Add conversion tracking to recipes table
ALTER TABLE public.recipes 
ADD COLUMN conversion_count INTEGER DEFAULT 0,
ADD COLUMN last_converted_at TIMESTAMP WITH TIME ZONE;

-- Add conversion tracking to user_recipes table  
ALTER TABLE public.user_recipes
ADD COLUMN conversion_count INTEGER DEFAULT 0,
ADD COLUMN last_converted_at TIMESTAMP WITH TIME ZONE;

-- Create a function to get most converted recipes
CREATE OR REPLACE FUNCTION public.get_most_converted_recipes(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  original_recipe TEXT,
  converted_recipe TEXT,
  ingredients JSONB,
  instructions TEXT[],
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty_level TEXT,
  cuisine_type TEXT,
  calories_per_serving INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  sugar_g NUMERIC,
  sodium_mg NUMERIC,
  cholesterol_mg NUMERIC,
  image_url TEXT,
  average_rating NUMERIC,
  rating_count INTEGER,
  conversion_count INTEGER,
  last_converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
AS $$
  -- Get from both recipes and user_recipes tables, combining results
  WITH combined_recipes AS (
    SELECT 
      r.id, r.title, r.original_recipe, r.converted_recipe, r.ingredients, r.instructions,
      r.prep_time, r.cook_time, r.servings, r.difficulty_level, r.cuisine_type,
      r.calories_per_serving, r.protein_g, r.carbs_g, r.fat_g, r.fiber_g, r.sugar_g,
      r.sodium_mg, r.cholesterol_mg, r.image_url, r.average_rating, r.rating_count,
      COALESCE(r.conversion_count, 0) as conversion_count,
      r.last_converted_at, r.created_at
    FROM public.recipes r
    WHERE r.is_public = true
    
    UNION ALL
    
    SELECT 
      ur.id, ur.title, ur.original_recipe, ur.converted_recipe, ur.ingredients, ur.instructions,
      ur.prep_time, ur.cook_time, ur.servings, ur.difficulty_level, ur.cuisine_type,
      ur.calories_per_serving, ur.protein_g, ur.carbs_g, ur.fat_g, ur.fiber_g, ur.sugar_g,
      ur.sodium_mg, ur.cholesterol_mg, ur.image_url, ur.average_rating, ur.rating_count,
      COALESCE(ur.conversion_count, 0) as conversion_count,
      ur.last_converted_at, ur.created_at
    FROM public.user_recipes ur
    WHERE ur.is_public = true
  )
  SELECT * FROM combined_recipes
  WHERE conversion_count > 0
  ORDER BY conversion_count DESC, last_converted_at DESC NULLS LAST
  LIMIT limit_count;
$$;

-- Create function to increment conversion count
CREATE OR REPLACE FUNCTION public.increment_recipe_conversion_count(recipe_id UUID, table_name TEXT DEFAULT 'recipes')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF table_name = 'user_recipes' THEN
    UPDATE public.user_recipes 
    SET 
      conversion_count = COALESCE(conversion_count, 0) + 1,
      last_converted_at = NOW()
    WHERE id = recipe_id;
  ELSE
    UPDATE public.recipes 
    SET 
      conversion_count = COALESCE(conversion_count, 0) + 1,
      last_converted_at = NOW()
    WHERE id = recipe_id;
  END IF;
END;
$$;
