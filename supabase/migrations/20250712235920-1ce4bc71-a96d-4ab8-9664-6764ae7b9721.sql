UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed',
    error_message = 'Function appears to have crashed - forcing restart from recipe 191',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';