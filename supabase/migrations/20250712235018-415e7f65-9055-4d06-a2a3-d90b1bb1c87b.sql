UPDATE recipe_generation_progress 
SET total_recipes = 400,
    status = 'timeout_restart_needed',
    error_message = 'Optimized function - ready to restart with improved speed',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';