
-- Add columns to user_favorites table to store ingredient scan analysis results
ALTER TABLE public.user_favorites 
ADD COLUMN IF NOT EXISTS product_analysis TEXT,
ADD COLUMN IF NOT EXISTS safety_rating TEXT,
ADD COLUMN IF NOT EXISTS allergen_warnings TEXT[],
ADD COLUMN IF NOT EXISTS gluten_status TEXT,
ADD COLUMN IF NOT EXISTS dairy_status TEXT,
ADD COLUMN IF NOT EXISTS vegan_status TEXT;

-- Add index for better performance on ingredient scan queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_analysis ON public.user_favorites(product_analysis) WHERE product_analysis IS NOT NULL;

-- Update RLS policies to ensure users can still access their ingredient scan favorites
-- (The existing policies should already cover this, but let's make sure)
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
CREATE POLICY "Users can view their own favorites" 
  ON public.user_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own favorites" ON public.user_favorites;
CREATE POLICY "Users can create their own favorites" 
  ON public.user_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own favorites" ON public.user_favorites;
CREATE POLICY "Users can update their own favorites" 
  ON public.user_favorites 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete their own favorites" 
  ON public.user_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);
