-- Fix security vulnerability in subscription_events table
-- Restrict insertion to service role only to prevent unauthorized data insertion

-- Drop the overly permissive insert policy that allows anyone to insert events
DROP POLICY IF EXISTS "service_can_insert_subscription_events" ON public.subscription_events;

-- Create secure policy for service operations (edge functions only)
CREATE POLICY "Service role can insert subscription events" 
ON public.subscription_events 
FOR INSERT 
WITH CHECK (current_setting('role') = 'service_role');

-- Create policy for service role to manage all subscription events (for administrative purposes)
CREATE POLICY "Service role can manage subscription events" 
ON public.subscription_events 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- The existing "users_can_view_own_subscription_events" policy is already secure
-- It ensures users can only see their own subscription events based on user_id or email match