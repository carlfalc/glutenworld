-- Add dietary_labels column to recipes table
ALTER TABLE public.recipes 
ADD COLUMN dietary_labels TEXT[] DEFAULT '{Gluten-Free}';

-- Update existing recipes to have the Gluten-Free label
UPDATE public.recipes 
SET dietary_labels = '{Gluten-Free}' 
WHERE dietary_labels IS NULL OR array_length(dietary_labels, 1) IS NULL;