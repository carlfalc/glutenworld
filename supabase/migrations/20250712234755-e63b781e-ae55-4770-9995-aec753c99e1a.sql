UPDATE recipe_generation_progress 
SET total_recipes = 200,
    status = 'running',
    error_message = 'Target reduced to 200 recipes - continuing from 175',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';