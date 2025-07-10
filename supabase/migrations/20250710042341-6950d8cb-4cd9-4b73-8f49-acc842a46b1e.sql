-- Remove duplicate recipes (keep only the most recent one for each title)
DELETE FROM recipes 
WHERE id NOT IN (
  SELECT DISTINCT ON (title) id 
  FROM recipes 
  ORDER BY title, created_at DESC
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE recipes 
ADD CONSTRAINT unique_recipe_title UNIQUE (title);