-- Fix the last function
CREATE OR REPLACE FUNCTION public.get_most_converted_recipes(limit_count integer DEFAULT 10)
 RETURNS TABLE(id uuid, title text, original_recipe text, converted_recipe text, ingredients jsonb, instructions text[], prep_time integer, cook_time integer, servings integer, difficulty_level text, cuisine_type text, calories_per_serving integer, protein_g numeric, carbs_g numeric, fat_g numeric, fiber_g numeric, sugar_g numeric, sodium_mg numeric, cholesterol_mg numeric, image_url text, average_rating numeric, rating_count integer, conversion_count integer, last_converted_at timestamp with time zone, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
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
$function$;