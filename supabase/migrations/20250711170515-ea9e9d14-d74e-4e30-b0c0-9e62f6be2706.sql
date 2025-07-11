-- Delete existing record if any and insert new one
DELETE FROM public.ai_generator_access WHERE user_id = '476df910-dcd1-4421-b82a-4666df9399b5';

-- Insert new access record
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
);