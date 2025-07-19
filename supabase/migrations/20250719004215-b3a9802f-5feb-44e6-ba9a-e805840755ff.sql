-- Add trial tracking fields to subscribers table
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_used BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS features_locked BOOLEAN NOT NULL DEFAULT false;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_trial_end ON public.subscribers(trial_end_date);
CREATE INDEX IF NOT EXISTS idx_subscribers_features_locked ON public.subscribers(features_locked);

-- Function to start a 5-day trial for a user
CREATE OR REPLACE FUNCTION public.start_user_trial(user_email TEXT, user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.subscribers (
    email, 
    user_id, 
    trial_start_date, 
    trial_end_date, 
    trial_used,
    subscribed,
    features_locked,
    updated_at
  ) VALUES (
    user_email,
    user_id_param,
    NOW(),
    NOW() + INTERVAL '5 days',
    true,
    false,
    false,
    NOW()
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    trial_start_date = CASE 
      WHEN subscribers.trial_used = false THEN NOW()
      ELSE subscribers.trial_start_date
    END,
    trial_end_date = CASE 
      WHEN subscribers.trial_used = false THEN NOW() + INTERVAL '5 days'
      ELSE subscribers.trial_end_date
    END,
    trial_used = true,
    features_locked = false,
    updated_at = NOW();
END;
$$;

-- Function to check if trial has expired and lock features
CREATE OR REPLACE FUNCTION public.check_and_update_trial_status()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscribers 
  SET 
    features_locked = true,
    updated_at = NOW()
  WHERE 
    trial_used = true 
    AND subscribed = false 
    AND trial_end_date < NOW() 
    AND features_locked = false;
END;
$$;