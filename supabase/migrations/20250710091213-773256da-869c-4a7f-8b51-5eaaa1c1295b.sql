-- Clear existing recipes and repopulate with proper title-specific image mappings
DELETE FROM recipes WHERE user_id IS NULL;