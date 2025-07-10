-- Clear existing recipes and repopulate with correctly mapped food images
DELETE FROM recipes WHERE user_id IS NULL;