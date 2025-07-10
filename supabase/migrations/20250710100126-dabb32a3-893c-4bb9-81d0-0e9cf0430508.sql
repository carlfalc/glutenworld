-- Add rating system for recipes
CREATE TABLE public.recipe_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all ratings" 
ON public.recipe_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ratings" 
ON public.recipe_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.recipe_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.recipe_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add average rating and rating count to recipes table
ALTER TABLE public.recipes 
ADD COLUMN average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN rating_count INTEGER DEFAULT 0;

ALTER TABLE public.user_recipes 
ADD COLUMN average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN rating_count INTEGER DEFAULT 0;

-- Create function to update recipe ratings
CREATE OR REPLACE FUNCTION public.update_recipe_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ratings for recipes table
  UPDATE public.recipes 
  SET 
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating), 2) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    rating_count = COALESCE((
      SELECT COUNT(*) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0)
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  -- Update ratings for user_recipes table
  UPDATE public.user_recipes 
  SET 
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating), 2) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    rating_count = COALESCE((
      SELECT COUNT(*) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0)
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_recipe_ratings_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.recipe_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_recipe_ratings();