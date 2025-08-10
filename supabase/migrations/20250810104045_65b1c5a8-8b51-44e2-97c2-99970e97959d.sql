-- Fix security issues: Add SET search_path TO '' to all functions
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

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT public.has_role(_user_id, 'owner'::public.app_role)
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'owner' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.assign_owner_role()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  owner_user_id UUID;
BEGIN
  -- Get user ID for the owner email
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

CREATE OR REPLACE FUNCTION public.calculate_subscriber_recipe_hotlist()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Clear existing cache
  DELETE FROM public.recipe_hotlist_cache;
  
  -- Insert top recipes based on favorites from subscribed users
  INSERT INTO public.recipe_hotlist_cache (
    recipe_id, 
    recipe_title, 
    recipe_image_url, 
    save_count, 
    popularity_score, 
    last_saved_at
  )
  WITH subscriber_favorites AS (
    -- Get favorites from subscribed users only
    SELECT 
      uf.recipe_id,
      COUNT(*) as favorite_count,
      MAX(uf.created_at) as last_favorited
    FROM public.user_favorites uf
    INNER JOIN public.subscribers s ON s.user_id = uf.user_id
    WHERE 
      uf.type = 'recipe' 
      AND uf.recipe_id IS NOT NULL
      AND s.subscribed = true
      AND uf.created_at >= NOW() - INTERVAL '30 days' -- Only recent favorites
    GROUP BY uf.recipe_id
    HAVING COUNT(*) >= 2 -- At least 2 subscribers must have favorited it
  ),
  recipe_details AS (
    -- Get recipe details from both tables
    SELECT 
      r.id,
      r.title,
      r.image_url,
      'user_recipes' as source_table
    FROM public.user_recipes r
    WHERE r.is_public = true
    
    UNION ALL
    
    SELECT 
      r.id,
      r.title,
      r.image_url,
      'recipes' as source_table
    FROM public.recipes r
    WHERE r.is_public = true
  )
  SELECT 
    sf.recipe_id,
    rd.title,
    rd.image_url,
    sf.favorite_count::integer as save_count,
    -- Calculate popularity score (recency weighted)
    (sf.favorite_count * 
     EXTRACT(EPOCH FROM (NOW() - sf.last_favorited)) / 86400.0 -- days ago
    )::numeric as popularity_score,
    sf.last_favorited
  FROM subscriber_favorites sf
  INNER JOIN recipe_details rd ON rd.id = sf.recipe_id
  ORDER BY sf.favorite_count DESC, sf.last_favorited DESC
  LIMIT 20;
  
  -- Log the update
  RAISE NOTICE 'Recipe hotlist cache updated with % recipes at %', 
    (SELECT COUNT(*) FROM public.recipe_hotlist_cache), 
    NOW();
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_recipe_conversion_count(recipe_id uuid, table_name text DEFAULT 'recipes'::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF table_name = 'user_recipes' THEN
    UPDATE public.user_recipes 
    SET 
      conversion_count = COALESCE(conversion_count, 0) + 1,
      last_converted_at = NOW()
    WHERE id = recipe_id;
  ELSE
    UPDATE public.recipes 
    SET 
      conversion_count = COALESCE(conversion_count, 0) + 1,
      last_converted_at = NOW()
    WHERE id = recipe_id;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.start_user_trial(user_email text, user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.subscribers (
    email, 
    user_id, 
    trial_start_date, 
    trial_end_date, 
    trial_used,
    subscribed,
    features_locked,
    updated_at
  ) VALUES (
    user_email,
    user_id_param,
    NOW(),
    NOW() + INTERVAL '5 days',
    true,
    false,
    false,
    NOW()
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    trial_start_date = CASE 
      WHEN subscribers.trial_used = false THEN NOW()
      ELSE subscribers.trial_start_date
    END,
    trial_end_date = CASE 
      WHEN subscribers.trial_used = false THEN NOW() + INTERVAL '5 days'
      ELSE subscribers.trial_end_date
    END,
    trial_used = true,
    features_locked = false,
    updated_at = NOW();
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_update_trial_status()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.subscribers 
  SET 
    features_locked = true,
    updated_at = NOW()
  WHERE 
    trial_used = true 
    AND subscribed = false 
    AND trial_end_date < NOW() 
    AND features_locked = false;
END;
$function$;