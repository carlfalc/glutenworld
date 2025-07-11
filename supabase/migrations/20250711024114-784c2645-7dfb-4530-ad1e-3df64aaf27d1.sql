-- Create ai_generator_access table to track $4.99 upgrades
CREATE TABLE public.ai_generator_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  paid BOOLEAN NOT NULL DEFAULT false,
  amount INTEGER NOT NULL DEFAULT 499, -- $4.99 in cents
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.ai_generator_access ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own access
CREATE POLICY "Users can view their own AI generator access"
ON public.ai_generator_access
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for edge functions to manage access records
CREATE POLICY "Service can manage AI generator access"
ON public.ai_generator_access
FOR ALL
USING (true);