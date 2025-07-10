-- Fix the meatball image URL
UPDATE recipes 
SET image_url = 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400'
WHERE title = 'Gluten-Free Meatballs' 
AND image_url = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400';