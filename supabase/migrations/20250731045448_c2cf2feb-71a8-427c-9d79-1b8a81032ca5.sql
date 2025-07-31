-- Update the check constraint on user_favorites table to include 'business' type
ALTER TABLE public.user_favorites DROP CONSTRAINT IF EXISTS user_favorites_type_check;

-- Add new check constraint that includes 'business' type
ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_type_check 
CHECK (type IN ('recipe', 'product', 'business'));