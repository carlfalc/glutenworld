-- Fix the typo in owner email and assign owner role
CREATE OR REPLACE FUNCTION public.handle_owner_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Check if this is the owner email (fixed typo)
  IF NEW.email = 'falconercarlandrew@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Assign default user role to everyone else
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix the assign_owner_role function too
CREATE OR REPLACE FUNCTION public.assign_owner_role()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  owner_user_id UUID;
BEGIN
  -- Get user ID for the owner email (fixed typo)
  SELECT id INTO owner_user_id
  FROM auth.users
  WHERE email = 'falconercarlandrew@gmail.com';
  
  -- If user exists, assign owner role
  IF owner_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (owner_user_id, 'owner'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$function$;

-- Now assign the owner role to the existing user
SELECT public.assign_owner_role();