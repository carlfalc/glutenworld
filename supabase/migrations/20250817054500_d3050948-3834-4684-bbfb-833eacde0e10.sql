-- Fix critical security vulnerability in subscribers table
-- Remove the overly permissive policy that allows public access to sensitive subscription data

-- Drop the dangerous policy that allows unrestricted access to all subscription data
DROP POLICY IF EXISTS "Service can update subscriptions" ON public.subscribers;

-- Create secure policies for service operations (edge functions only)
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- Create policy for services to insert subscription records
CREATE POLICY "Service role can insert subscriptions" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (current_setting('role') = 'service_role');

-- Create policy for services to update subscription records (for webhook processing)
CREATE POLICY "Service role can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
USING (current_setting('role') = 'service_role');

-- The existing "Users can view their own subscription" policy is already secure
-- It ensures users can only see their own subscription data based on user_id or email match