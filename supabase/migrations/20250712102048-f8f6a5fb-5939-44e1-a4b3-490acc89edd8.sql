-- Fix progress tracking - sync with actual recipe count
UPDATE recipe_generation_progress 
SET generated_recipes = 153, 
    status = 'timeout_restart_needed',
    error_message = 'Progress sync fixed - found 153 existing recipes, continuing to 400',
    updated_at = now() 
WHERE status = 'running' AND generated_recipes = 0;