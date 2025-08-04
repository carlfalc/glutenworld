-- Create subscription_events table to track retention and other subscription events
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription events
CREATE POLICY "users_can_view_own_subscription_events" ON public.subscription_events
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to insert subscription events
CREATE POLICY "service_can_insert_subscription_events" ON public.subscription_events
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_email ON public.subscription_events(email);
CREATE INDEX IF NOT EXISTS idx_subscription_events_type ON public.subscription_events(event_type);