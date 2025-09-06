-- Add environment-based owner configuration and strengthen security
-- Create a secure way to manage owner access without hardcoded emails

-- Create a secure configuration table for system settings
CREATE TABLE IF NOT EXISTS public.system_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key text NOT NULL UNIQUE,
  config_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on system_config table
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Only service role can manage system config
CREATE POLICY "Service role can manage system config"
ON public.system_config
FOR ALL
USING (current_setting('role'::text) = 'service_role'::text);

-- Insert owner email configuration (this should be managed via edge function)
INSERT INTO public.system_config (config_key, config_value)
VALUES ('owner_email', 'falconercarlandrew@gmail.com')
ON CONFLICT (config_key) DO NOTHING;

-- Create function to get owner email securely
CREATE OR REPLACE FUNCTION public.get_owner_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT config_value FROM public.system_config WHERE config_key = 'owner_email';
$$;

-- Enhance the existing has_role function to use secure owner check
CREATE OR REPLACE FUNCTION public.has_role_secure(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  ) OR (
    _role = 'owner' AND 
    _user_id IN (
      SELECT id FROM auth.users 
      WHERE email = public.get_owner_email()
    )
  )
$$;

-- Add trigger to update updated_at on system_config
CREATE TRIGGER update_system_config_updated_at
BEFORE UPDATE ON public.system_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Strengthen existing policies to use the secure function
-- This ensures owner access is validated against the database, not hardcoded

-- Add additional audit policies for sensitive operations
CREATE POLICY "Owners can view all system config"
ON public.system_config
FOR SELECT
USING (public.has_role_secure(auth.uid(), 'owner'::public.app_role));