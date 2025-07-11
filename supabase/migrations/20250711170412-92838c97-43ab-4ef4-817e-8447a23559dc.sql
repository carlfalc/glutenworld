-- Update AI generator access for testing
INSERT INTO public.ai_generator_access (
  user_id,
  email,
  paid,
  amount,
  stripe_payment_intent_id
) VALUES (
  '476df910-dcd1-4421-b82a-4666df9399b5',
  'falconercarlandrew@gmail.com',
  true,
  499,
  'test_payment_intent_123'
) ON CONFLICT (email) 
DO UPDATE SET 
  paid = true,
  updated_at = now();