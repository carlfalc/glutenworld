-- Update the existing record to grant access
UPDATE ai_generator_access 
SET paid = true, updated_at = now() 
WHERE email = 'falconercarlandrew@gmail.com';