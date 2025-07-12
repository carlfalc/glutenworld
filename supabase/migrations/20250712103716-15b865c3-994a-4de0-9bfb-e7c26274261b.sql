-- Reset the stuck generation process
UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed',
    error_message = 'Process was stuck - resetting to restart generation from recipe 154',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';