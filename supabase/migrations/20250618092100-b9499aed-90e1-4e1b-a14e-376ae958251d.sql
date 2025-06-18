
-- Create user_favorites table to store both favorite recipes and scanned products
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recipe', 'product')),
  recipe_id UUID NULL REFERENCES public.user_recipes(id) ON DELETE CASCADE,
  product_name TEXT NULL,
  product_description TEXT NULL,
  product_image_url TEXT NULL,
  product_category TEXT NULL,
  product_scanned_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure that recipe favorites have recipe_id and product favorites have product info
  CONSTRAINT valid_recipe_favorite CHECK (
    (type = 'recipe' AND recipe_id IS NOT NULL AND product_name IS NULL) OR
    (type = 'product' AND recipe_id IS NULL AND product_name IS NOT NULL)
  ),
  
  -- Prevent duplicate favorites
  UNIQUE(user_id, type, recipe_id),
  UNIQUE(user_id, type, product_name)
);

-- Add Row Level Security
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.user_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.user_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" 
  ON public.user_favorites 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.user_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_type ON public.user_favorites(type);
CREATE INDEX idx_user_favorites_recipe_id ON public.user_favorites(recipe_id) WHERE recipe_id IS NOT NULL;
