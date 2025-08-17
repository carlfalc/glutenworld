-- Fix critical security vulnerability in ai_generator_access table
-- Remove the overly permissive policy that allows public access to sensitive payment data

-- Drop the dangerous policy that allows unrestricted access
DROP POLICY IF EXISTS "Service can manage AI generator access" ON public.ai_generator_access;

-- Create secure policies for service operations (edge functions only)
CREATE POLICY "Service role can manage AI generator access" 
ON public.ai_generator_access 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- Create policy for users to insert their own records (for edge functions acting on behalf of users)
CREATE POLICY "Users can insert their own AI generator access" 
ON public.ai_generator_access 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for services to update records (for payment confirmations)
CREATE POLICY "Service role can update AI generator access" 
ON public.ai_generator_access 
FOR UPDATE 
USING (current_setting('role') = 'service_role');

-- The existing "Users can view their own AI generator access" policy is already secure
-- It ensures users can only see their own payment records