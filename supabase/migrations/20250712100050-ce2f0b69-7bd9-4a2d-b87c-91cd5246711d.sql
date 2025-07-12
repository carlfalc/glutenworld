-- Reset the progress status to allow continuation
UPDATE recipe_generation_progress 
SET status = 'timeout_restart_needed', 
    error_message = 'Restarting to complete remaining recipes (153/400 so far)', 
    updated_at = now() 
WHERE status = 'completed' AND generated_recipes < 400;