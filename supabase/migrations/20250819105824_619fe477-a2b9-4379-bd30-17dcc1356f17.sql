
BEGIN;

-- 1) Enforce RLS on subscription_events
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Replace SELECT policy so users can only view their own events
DROP POLICY IF EXISTS "users_can_view_own_subscription_events" ON public.subscription_events;
CREATE POLICY "users_can_view_own_subscription_events"
ON public.subscription_events
FOR SELECT
USING ((user_id = auth.uid()) OR (email = auth.email()));

-- Only service role can insert/manage (for webhooks and server tasks)
DROP POLICY IF EXISTS "Service role can insert subscription events" ON public.subscription_events;
CREATE POLICY "Service role can insert subscription events"
ON public.subscription_events
FOR INSERT
WITH CHECK (current_setting('role') = 'service_role');

DROP POLICY IF EXISTS "Service role can manage subscription events" ON public.subscription_events;
CREATE POLICY "Service role can manage subscription events"
ON public.subscription_events
FOR ALL
USING (current_setting('role') = 'service_role');

-- 2) Enforce RLS on ai_generator_access
ALTER TABLE public.ai_generator_access ENABLE ROW LEVEL SECURITY;

-- Users can only insert their own row
DROP POLICY IF EXISTS "Users can insert their own AI generator access" ON public.ai_generator_access;
CREATE POLICY "Users can insert their own AI generator access"
ON public.ai_generator_access
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own row
DROP POLICY IF EXISTS "Users can view their own AI generator access" ON public.ai_generator_access;
CREATE POLICY "Users can view their own AI generator access"
ON public.ai_generator_access
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage (covers UPDATE/DELETE/INSERT/SELECT for backend tasks)
DROP POLICY IF EXISTS "Service role can manage AI generator access" ON public.ai_generator_access;
CREATE POLICY "Service role can manage AI generator access"
ON public.ai_generator_access
FOR ALL
USING (current_setting('role') = 'service_role');

-- Remove redundant policy if present
DROP POLICY IF EXISTS "Service role can update AI generator access" ON public.ai_generator_access;

-- 3) Defense-in-depth: revoke any direct grants (RLS still governs access)
REVOKE ALL ON TABLE public.subscription_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ai_generator_access FROM PUBLIC, anon, authenticated;

-- 4) Move pg_net extension out of public to extensions schema (linter fix)
CREATE SCHEMA IF NOT EXISTS extensions;

DO $do$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'pg_net' AND n.nspname = 'public'
  ) THEN
    ALTER EXTENSION "pg_net" SET SCHEMA extensions;
  END IF;
END;
$do$;

COMMIT;
