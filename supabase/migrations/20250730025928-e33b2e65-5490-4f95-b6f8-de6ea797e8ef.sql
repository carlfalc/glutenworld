-- Add business-related columns to user_favorites table for store locator favorites
ALTER TABLE public.user_favorites 
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_address text,
ADD COLUMN IF NOT EXISTS business_phone text,
ADD COLUMN IF NOT EXISTS business_website text,
ADD COLUMN IF NOT EXISTS business_rating numeric,
ADD COLUMN IF NOT EXISTS business_price_level integer,
ADD COLUMN IF NOT EXISTS business_types text[],
ADD COLUMN IF NOT EXISTS business_category text,
ADD COLUMN IF NOT EXISTS business_photo_reference text,
ADD COLUMN IF NOT EXISTS business_latitude numeric,
ADD COLUMN IF NOT EXISTS business_longitude numeric,
ADD COLUMN IF NOT EXISTS business_opening_hours jsonb,
ADD COLUMN IF NOT EXISTS business_google_maps_url text;