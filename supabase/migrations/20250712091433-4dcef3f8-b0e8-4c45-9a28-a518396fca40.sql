-- Reset the stuck progress entry to allow restarting
UPDATE public.recipe_generation_progress 
SET status = 'failed', 
    error_message = 'Generation process timed out or crashed',
    updated_at = now()
WHERE id = 'a272fea6-7742-4484-914d-c1e5047f38fa';