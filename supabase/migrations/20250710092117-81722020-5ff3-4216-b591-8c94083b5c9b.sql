-- Clear existing recipes and repopulate with unique image mappings
DELETE FROM recipes WHERE user_id IS NULL;