-- Clear existing recipes and repopulate with proper image mappings
DELETE FROM recipes WHERE user_id IS NULL;