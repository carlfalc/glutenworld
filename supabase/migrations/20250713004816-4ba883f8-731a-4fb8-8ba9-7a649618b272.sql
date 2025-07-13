-- Force restart the stuck recipe generation
UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed',
    error_message = 'Generation stuck - forcing restart to complete remaining 182 recipes',
    started_at = now(),
    current_category = null,
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';