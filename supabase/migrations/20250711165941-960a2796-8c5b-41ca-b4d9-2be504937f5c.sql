-- Update user subscription status for testing
UPDATE public.subscribers 
SET 
  subscribed = true,
  subscription_tier = 'Annual',
  subscription_end = (now() + interval '1 year')
WHERE email = 'falconercarlandrew@gmail.com';

-- If no record exists, insert one
INSERT INTO public.subscribers (
  email, 
  user_id, 
  subscribed, 
  subscription_tier, 
  subscription_end
) 
SELECT 
  'falconercarlandrew@gmail.com',
  '476df910-dcd1-4421-b82a-4666df9399b5',
  true,
  'Annual',
  (now() + interval '1 year')
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscribers 
  WHERE email = 'falconercarlandrew@gmail.com'
);