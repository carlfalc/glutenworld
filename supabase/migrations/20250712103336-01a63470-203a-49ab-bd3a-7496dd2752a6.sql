-- Update progress to reflect actual recipe count
UPDATE recipe_generation_progress 
SET generated_recipes = 153,
    current_category = 'Continuing generation...',
    error_message = 'Synced progress with actual recipe count (153), continuing generation...',
    updated_at = now()
WHERE id = '2a809334-670f-40d4-b87c-ef4febdb429e';