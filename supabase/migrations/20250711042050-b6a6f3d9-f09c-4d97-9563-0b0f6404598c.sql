-- Grant AI generator access for testing
INSERT INTO ai_generator_access (user_id, email, paid, amount, updated_at)
VALUES (
  (SELECT auth.uid()),
  (SELECT auth.email()),
  true,
  499,
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  paid = true,
  updated_at = now();