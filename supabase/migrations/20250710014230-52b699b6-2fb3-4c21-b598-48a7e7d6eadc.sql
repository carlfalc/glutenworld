-- Add nutritional information columns to the recipes table
ALTER TABLE public.recipes 
ADD COLUMN calories_per_serving INTEGER,
ADD COLUMN protein_g DECIMAL(5,2),
ADD COLUMN carbs_g DECIMAL(5,2),
ADD COLUMN fat_g DECIMAL(5,2),
ADD COLUMN fiber_g DECIMAL(5,2),
ADD COLUMN sugar_g DECIMAL(5,2),
ADD COLUMN sodium_mg DECIMAL(7,2),
ADD COLUMN cholesterol_mg DECIMAL(6,2),
ADD COLUMN image_url TEXT;

-- Add nutritional information columns to the user_recipes table as well
ALTER TABLE public.user_recipes 
ADD COLUMN calories_per_serving INTEGER,
ADD COLUMN protein_g DECIMAL(5,2),
ADD COLUMN carbs_g DECIMAL(5,2),
ADD COLUMN fat_g DECIMAL(5,2),
ADD COLUMN fiber_g DECIMAL(5,2),
ADD COLUMN sugar_g DECIMAL(5,2),
ADD COLUMN sodium_mg DECIMAL(7,2),
ADD COLUMN cholesterol_mg DECIMAL(6,2),
ADD COLUMN image_url TEXT;

-- Add indexes for better search performance
CREATE INDEX idx_recipes_title_search ON public.recipes USING gin(to_tsvector('english', title));
CREATE INDEX idx_recipes_difficulty ON public.recipes(difficulty_level);
CREATE INDEX idx_recipes_cuisine ON public.recipes(cuisine_type);
CREATE INDEX idx_recipes_prep_time ON public.recipes(prep_time);
CREATE INDEX idx_recipes_calories ON public.recipes(calories_per_serving);

-- Add similar indexes for user_recipes
CREATE INDEX idx_user_recipes_title_search ON public.user_recipes USING gin(to_tsvector('english', title));
CREATE INDEX idx_user_recipes_difficulty ON public.user_recipes(difficulty_level);
CREATE INDEX idx_user_recipes_cuisine ON public.user_recipes(cuisine_type);