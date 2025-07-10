-- Clear existing recipes and repopulate with food-specific images
DELETE FROM recipes WHERE user_id IS NULL;