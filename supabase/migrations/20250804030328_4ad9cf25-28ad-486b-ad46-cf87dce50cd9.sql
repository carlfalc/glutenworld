-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create recipe hotlist cache table
CREATE TABLE public.recipe_hotlist_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id uuid NOT NULL,
  recipe_title text NOT NULL,
  recipe_image_url text,
  save_count integer NOT NULL DEFAULT 0,
  popularity_score numeric NOT NULL DEFAULT 0,
  last_saved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipe_hotlist_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is hotlist data)
CREATE POLICY "Anyone can view recipe hotlist cache" 
ON public.recipe_hotlist_cache 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_recipe_hotlist_cache_popularity ON public.recipe_hotlist_cache(popularity_score DESC, save_count DESC);

-- Create function to calculate recipe hotlist based on subscriber favorites
CREATE OR REPLACE FUNCTION public.calculate_subscriber_recipe_hotlist()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear existing cache
  DELETE FROM public.recipe_hotlist_cache;
  
  -- Insert top recipes based on favorites from subscribed users
  INSERT INTO public.recipe_hotlist_cache (
    recipe_id, 
    recipe_title, 
    recipe_image_url, 
    save_count, 
    popularity_score, 
    last_saved_at
  )
  WITH subscriber_favorites AS (
    -- Get favorites from subscribed users only
    SELECT 
      uf.recipe_id,
      COUNT(*) as favorite_count,
      MAX(uf.created_at) as last_favorited
    FROM public.user_favorites uf
    INNER JOIN public.subscribers s ON s.user_id = uf.user_id
    WHERE 
      uf.type = 'recipe' 
      AND uf.recipe_id IS NOT NULL
      AND s.subscribed = true
      AND uf.created_at >= NOW() - INTERVAL '30 days' -- Only recent favorites
    GROUP BY uf.recipe_id
    HAVING COUNT(*) >= 2 -- At least 2 subscribers must have favorited it
  ),
  recipe_details AS (
    -- Get recipe details from both tables
    SELECT 
      r.id,
      r.title,
      r.image_url,
      'user_recipes' as source_table
    FROM public.user_recipes r
    WHERE r.is_public = true
    
    UNION ALL
    
    SELECT 
      r.id,
      r.title,
      r.image_url,
      'recipes' as source_table
    FROM public.recipes r
    WHERE r.is_public = true
  )
  SELECT 
    sf.recipe_id,
    rd.title,
    rd.image_url,
    sf.favorite_count::integer as save_count,
    -- Calculate popularity score (recency weighted)
    (sf.favorite_count * 
     EXTRACT(EPOCH FROM (NOW() - sf.last_favorited)) / 86400.0 -- days ago
    )::numeric as popularity_score,
    sf.last_favorited
  FROM subscriber_favorites sf
  INNER JOIN recipe_details rd ON rd.id = sf.recipe_id
  ORDER BY sf.favorite_count DESC, sf.last_favorited DESC
  LIMIT 20;
  
  -- Log the update
  RAISE NOTICE 'Recipe hotlist cache updated with % recipes at %', 
    (SELECT COUNT(*) FROM public.recipe_hotlist_cache), 
    NOW();
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_recipe_hotlist_cache_updated_at
  BEFORE UPDATE ON public.recipe_hotlist_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Schedule the cron job to run daily at 2 AM
SELECT cron.schedule(
  'update-recipe-hotlist-cache',
  '0 2 * * *', -- Every day at 2 AM
  $$
  SELECT public.calculate_subscriber_recipe_hotlist();
  $$
);

-- Run it once to populate initial data
SELECT public.calculate_subscriber_recipe_hotlist();