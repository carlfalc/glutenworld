-- Fix remaining functions without SET search_path
CREATE OR REPLACE FUNCTION public.handle_owner_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Check if this is the owner email
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_community_member, community_joined_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    true,  -- Auto-join community
    NOW()  -- Set community joined time
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_community_stats()
 RETURNS json
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM public.profiles WHERE is_community_member = true),
    'total_posts', (SELECT COUNT(*) FROM public.community_posts),
    'total_categories', (SELECT COUNT(*) FROM public.community_categories),
    'new_members_this_week', (
      SELECT COUNT(*) 
      FROM public.profiles 
      WHERE is_community_member = true 
      AND community_joined_at >= NOW() - INTERVAL '7 days'
    )
  );
$function$;

CREATE OR REPLACE FUNCTION public.update_post_counts()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.community_posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.community_posts 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.post_id;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_recipe_ratings()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Update ratings for recipes table
  UPDATE public.recipes 
  SET 
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating), 2) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    rating_count = COALESCE((
      SELECT COUNT(*) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0)
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  -- Update ratings for user_recipes table
  UPDATE public.user_recipes 
  SET 
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating), 2) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    rating_count = COALESCE((
      SELECT COUNT(*) 
      FROM public.recipe_ratings 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0)
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;