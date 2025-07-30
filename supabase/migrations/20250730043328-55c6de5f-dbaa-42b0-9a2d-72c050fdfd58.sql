-- Add "tester" to the existing app_role enum type
ALTER TYPE public.app_role ADD VALUE 'tester';

-- Create a helper function to check if user is tester or owner
CREATE OR REPLACE FUNCTION public.is_tester_or_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('owner'::public.app_role, 'tester'::public.app_role)
  )
$function$;

-- Assign tester role to the owner email account
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'tester'::public.app_role
FROM auth.users
WHERE email = 'falconercarlandrew@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;