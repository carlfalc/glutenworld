-- Create a function to get user authentication providers
CREATE OR REPLACE FUNCTION public.get_user_auth_providers(user_email text)
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT ARRAY_AGG(DISTINCT i.provider)
  FROM auth.users u
  JOIN auth.identities i ON u.id = i.user_id
  WHERE u.email = user_email;
$function$;