-- Reset the stuck progress entry to allow restarting from where it left off
UPDATE public.recipe_generation_progress 
SET status = 'failed', 
    error_message = 'Generation stalled at 111 recipes during Lunch category',
    updated_at = now()
WHERE id = 'ffccc26b-443b-446f-982e-b087a0b6cf2c';