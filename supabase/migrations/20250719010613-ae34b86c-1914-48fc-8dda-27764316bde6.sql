-- Update subscribers table to track Stripe subscription IDs and trial status
ALTER TABLE public.subscribers 
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN trial_expires_at TIMESTAMPTZ;

-- Add index for better performance
CREATE INDEX idx_subscribers_stripe_subscription_id ON public.subscribers(stripe_subscription_id);
CREATE INDEX idx_subscribers_subscription_status ON public.subscribers(subscription_status);