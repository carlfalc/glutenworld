-- Enhance profiles table for community features
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN location TEXT,
ADD COLUMN dietary_preferences TEXT[] DEFAULT '{}',
ADD COLUMN community_joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN is_community_member BOOLEAN DEFAULT true;

-- Create community categories table
CREATE TABLE public.community_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.community_categories (name, description, icon) VALUES
('General Discussion', 'General gluten-free topics and questions', 'MessageCircle'),
('Recipes & Cooking', 'Share and discuss gluten-free recipes', 'ChefHat'),
('Product Reviews', 'Reviews of gluten-free products', 'Star'),
('Restaurants & Travel', 'Gluten-free dining and travel tips', 'MapPin'),
('Health & Wellness', 'Health topics related to gluten-free living', 'Heart'),
('Success Stories', 'Share your gluten-free journey successes', 'Trophy');

-- Add category to community posts
ALTER TABLE public.community_posts 
ADD COLUMN category_id UUID REFERENCES public.community_categories(id),
ADD COLUMN title TEXT,
ADD COLUMN image_url TEXT;

-- Create user follows table for community connections
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on new tables
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for community categories (public read)
CREATE POLICY "Anyone can view community categories" 
ON public.community_categories 
FOR SELECT 
USING (true);

-- RLS policies for user follows
CREATE POLICY "Users can view all follows" 
ON public.user_follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create follows" 
ON public.user_follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" 
ON public.user_follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Update existing community posts to have titles
UPDATE public.community_posts 
SET title = 'Community Post'
WHERE title IS NULL;

-- Make title required going forward
ALTER TABLE public.community_posts 
ALTER COLUMN title SET NOT NULL;

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get community stats
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS JSON
LANGUAGE SQL
STABLE
AS $$
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM public.profiles WHERE is_community_member = true),
    'total_posts', (SELECT COUNT(*) FROM public.community_posts),
    'total_categories', (SELECT COUNT(*) FROM public.community_categories),
    'new_members_this_week', (
      SELECT COUNT(*) 
      FROM public.profiles 
      WHERE is_community_member = true 
      AND community_joined_at >= NOW() - INTERVAL '7 days'
    )
  );
$$;