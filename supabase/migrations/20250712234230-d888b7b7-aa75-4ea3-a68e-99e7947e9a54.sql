UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed', 
    error_message = 'Process stuck for over 13 hours - needs restart',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';