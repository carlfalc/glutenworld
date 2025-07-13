-- Force restart the recipe generation by resetting the status
UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed',
    error_message = null,
    started_at = now(),
    current_category = null,
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';