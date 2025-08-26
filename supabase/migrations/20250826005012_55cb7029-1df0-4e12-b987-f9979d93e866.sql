-- Ensure RLS is enabled on ai_generator_access table
ALTER TABLE public.ai_generator_access ENABLE ROW LEVEL SECURITY;

-- Drop any potentially insecure policies that might allow public access
DROP POLICY IF EXISTS "Anyone can view ai generator access" ON public.ai_generator_access;
DROP POLICY IF EXISTS "Public can view ai generator access" ON public.ai_generator_access;
DROP POLICY IF EXISTS "Public access to ai generator access" ON public.ai_generator_access;

-- Ensure only proper policies exist for ai_generator_access
-- Keep the existing secure policies and recreate them to ensure they're correct

-- Policy for service role to manage all operations
DROP POLICY IF EXISTS "Service role can manage AI generator access" ON public.ai_generator_access;
CREATE POLICY "Service role can manage AI generator access" 
ON public.ai_generator_access 
FOR ALL 
USING (current_setting('role'::text) = 'service_role'::text);

-- Policy for service role to update (redundant but keeping for clarity)
DROP POLICY IF EXISTS "Service role can update AI generator access" ON public.ai_generator_access;
CREATE POLICY "Service role can update AI generator access" 
ON public.ai_generator_access 
FOR UPDATE 
USING (current_setting('role'::text) = 'service_role'::text);

-- Policy for users to insert only their own access records
DROP POLICY IF EXISTS "Users can insert their own AI generator access" ON public.ai_generator_access;
CREATE POLICY "Users can insert their own AI generator access" 
ON public.ai_generator_access 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to view only their own access records
DROP POLICY IF EXISTS "Users can view their own AI generator access" ON public.ai_generator_access;
CREATE POLICY "Users can view their own AI generator access" 
ON public.ai_generator_access 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure no other operations are allowed for regular users
-- Only authenticated users can view/insert their own records
-- All management operations require service_role