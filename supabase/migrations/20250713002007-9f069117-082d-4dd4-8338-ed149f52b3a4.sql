UPDATE recipe_generation_progress 
SET status = 'pending',
    error_message = null,
    started_at = now(),
    current_category = null,
    updated_at = now(),
    generated_recipes = 190
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';