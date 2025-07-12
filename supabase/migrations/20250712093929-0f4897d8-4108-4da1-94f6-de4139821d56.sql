-- Reset the stuck progress entry at 153 recipes to allow restarting
UPDATE public.recipe_generation_progress 
SET status = 'failed', 
    error_message = 'Generation process stalled at 153 recipes during Dinner category',
    updated_at = now()
WHERE id = 'a1c1a06f-2f18-4680-bcb5-e22b1ede108d';