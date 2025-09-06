-- Fix: Re-run migration without unsupported IF NOT EXISTS on CREATE POLICY
-- Use pg_policies check within DO blocks instead.

-- Ensure RLS is enabled on all sensitive tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_generator_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- Clean up any potential public SELECT policies that might exist (safely drop if present)
DO $$
BEGIN
  -- profiles
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public access to profiles" ON public.profiles;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- subscribers
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view subscribers" ON public.subscribers;
    DROP POLICY IF EXISTS "Public can view subscribers" ON public.subscribers;
    DROP POLICY IF EXISTS "Public access to subscribers" ON public.subscribers;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- user_addresses
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view user addresses" ON public.user_addresses;
    DROP POLICY IF EXISTS "Public can view user addresses" ON public.user_addresses;
    DROP POLICY IF EXISTS "Public access to user addresses" ON public.user_addresses;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- email_logs
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view email logs" ON public.email_logs;
    DROP POLICY IF EXISTS "Public can view email logs" ON public.email_logs;
    DROP POLICY IF EXISTS "Public access to email logs" ON public.email_logs;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- email_preferences
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view email preferences" ON public.email_preferences;
    DROP POLICY IF EXISTS "Public can view email preferences" ON public.email_preferences;
    DROP POLICY IF EXISTS "Public access to email preferences" ON public.email_preferences;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- ai_generator_access
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view ai generator access" ON public.ai_generator_access;
    DROP POLICY IF EXISTS "Public can view ai generator access" ON public.ai_generator_access;
    DROP POLICY IF EXISTS "Public access to ai generator access" ON public.ai_generator_access;
  EXCEPTION WHEN undefined_table THEN NULL; END;

  -- user_roles
  BEGIN
    DROP POLICY IF EXISTS "Anyone can view user roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Public can view user roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Public access to user roles" ON public.user_roles;
  EXCEPTION WHEN undefined_table THEN NULL; END;
END $$;

-- Add privileged read access for admins/owners where appropriate using guards
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND polname = 'Admins/Owners can view all profiles'
  ) THEN
    CREATE POLICY "Admins/Owners can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscribers' AND polname = 'Admins/Owners can view all subscriptions'
  ) THEN
    CREATE POLICY "Admins/Owners can view all subscriptions"
    ON public.subscribers
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_addresses' AND polname = 'Admins/Owners can view all addresses'
  ) THEN
    CREATE POLICY "Admins/Owners can view all addresses"
    ON public.user_addresses
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'email_logs' AND polname = 'Admins/Owners can view all email logs'
  ) THEN
    CREATE POLICY "Admins/Owners can view all email logs"
    ON public.email_logs
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'email_preferences' AND polname = 'Admins/Owners can view all email preferences'
  ) THEN
    CREATE POLICY "Admins/Owners can view all email preferences"
    ON public.email_preferences
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_generator_access' AND polname = 'Admins/Owners can view all AI generator access'
  ) THEN
    CREATE POLICY "Admins/Owners can view all AI generator access"
    ON public.ai_generator_access
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND polname = 'Admins/Owners can view all user roles'
  ) THEN
    CREATE POLICY "Admins/Owners can view all user roles"
    ON public.user_roles
    FOR SELECT
    USING (
      public.has_role(auth.uid(), 'owner'::public.app_role)
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;

-- End of migration