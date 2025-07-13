-- Stop the current recipe generation
UPDATE recipe_generation_progress 
SET status = 'stopped',
    error_message = 'Generation stopped by admin - converting to public access model',
    completed_at = now(),
    updated_at = now()
WHERE status IN ('in_progress', 'pending', 'timeout_restart_needed');

-- Make all existing generated recipes public and accessible to all users
UPDATE recipes 
SET is_public = true,
    user_id = null
WHERE user_id IS NOT NULL;

-- Update the recipes to ensure they're categorized properly for browsing
-- Add any missing dietary labels if needed
UPDATE recipes 
SET dietary_labels = COALESCE(dietary_labels, '{}') || '{Gluten-Free}'::text[]
WHERE 'Gluten-Free' != ALL(COALESCE(dietary_labels, '{}'));