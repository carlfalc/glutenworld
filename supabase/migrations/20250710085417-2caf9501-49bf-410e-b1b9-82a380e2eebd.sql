-- Clear existing recipes to refresh with proper image URLs
DELETE FROM recipes WHERE user_id IS NULL;