-- Update the valid_recipe_favorite constraint to include business type
ALTER TABLE public.user_favorites DROP CONSTRAINT IF EXISTS valid_recipe_favorite;

-- Add updated constraint that handles all three types: recipe, product, and business
ALTER TABLE public.user_favorites ADD CONSTRAINT valid_recipe_favorite 
CHECK (
  ((type = 'recipe' AND recipe_id IS NOT NULL AND product_name IS NULL AND business_name IS NULL)) OR
  ((type = 'product' AND recipe_id IS NULL AND product_name IS NOT NULL AND business_name IS NULL)) OR
  ((type = 'business' AND recipe_id IS NULL AND product_name IS NULL AND business_name IS NOT NULL))
);