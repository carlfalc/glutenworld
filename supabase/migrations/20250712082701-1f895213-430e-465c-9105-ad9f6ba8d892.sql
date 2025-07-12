-- Create a table to track recipe generation progress
CREATE TABLE public.recipe_generation_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  total_recipes INTEGER DEFAULT 400,
  generated_recipes INTEGER DEFAULT 0,
  current_category TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recipe_generation_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe generation progress
CREATE POLICY "Users can view their own progress" 
ON public.recipe_generation_progress 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create progress entries" 
ON public.recipe_generation_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own progress" 
ON public.recipe_generation_progress 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recipe_generation_progress_updated_at
BEFORE UPDATE ON public.recipe_generation_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();