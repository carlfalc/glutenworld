-- Ensure RLS is enabled on subscription_events table
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Drop any potentially insecure policies
DROP POLICY IF EXISTS "Anyone can view subscription events" ON public.subscription_events;
DROP POLICY IF EXISTS "Public can view subscription events" ON public.subscription_events;

-- Ensure only proper policies exist for subscription_events
-- Keep the existing secure policies and create a comprehensive set

-- Policy for service role to manage all operations (already exists but ensuring it's correct)
DROP POLICY IF EXISTS "Service role can manage subscription events" ON public.subscription_events;
CREATE POLICY "Service role can manage subscription events" 
ON public.subscription_events 
FOR ALL 
USING (current_setting('role'::text) = 'service_role'::text);

-- Policy for service role to insert (redundant but keeping for clarity)
DROP POLICY IF EXISTS "Service role can insert subscription events" ON public.subscription_events;
CREATE POLICY "Service role can insert subscription events" 
ON public.subscription_events 
FOR INSERT 
WITH CHECK (current_setting('role'::text) = 'service_role'::text);

-- Policy for users to view only their own subscription events
DROP POLICY IF EXISTS "users_can_view_own_subscription_events" ON public.subscription_events;
CREATE POLICY "Users can view own subscription events" 
ON public.subscription_events 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    (user_id = auth.uid()) OR 
    (email = auth.email())
  )
);

-- Ensure no other operations are allowed for regular users
-- Only SELECT is allowed for authenticated users viewing their own data
-- All other operations require service_role