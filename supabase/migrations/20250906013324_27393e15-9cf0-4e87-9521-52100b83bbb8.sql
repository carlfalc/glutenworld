-- Phase 1: Enforce strict RLS on sensitive tables and remove any public access
-- This migration is idempotent and only adds missing protections or safe overrides.

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

-- Add privileged read access for admins/owners where appropriate (non-recursive via SECURITY DEFINER fn public.has_role)
-- PROFILES: keep self-access policy intact, add admin/owner read-all
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all profiles"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- SUBSCRIBERS: add admin/owner read-all (user self-select already exists)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all subscriptions"
ON public.subscribers
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- USER_ADDRESSES: add admin/owner read-all (self policies already exist)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all addresses"
ON public.user_addresses
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- EMAIL_LOGS: add admin/owner read-all (self + service policies already exist)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all email logs"
ON public.email_logs
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- EMAIL_PREFERENCES: add admin/owner read-all (self + service policies already exist)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all email preferences"
ON public.email_preferences
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- AI_GENERATOR_ACCESS: ensure owner/admin can audit all (self + service policies already exist)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all AI generator access"
ON public.ai_generator_access
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- USER_ROLES: allow owner/admin to view all roles (self + service already exist)
CREATE POLICY IF NOT EXISTS "Admins/Owners can view all user roles"
ON public.user_roles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Note: We intentionally do not broaden INSERT/UPDATE/DELETE rights.
-- Existing self-only and service_role policies remain authoritative.
