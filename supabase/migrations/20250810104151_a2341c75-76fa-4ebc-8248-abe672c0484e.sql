-- Insert initial community categories if they don't exist
INSERT INTO public.community_categories (name, description, icon, color) 
SELECT * FROM (VALUES 
  ('Recipes & Cooking', 'Share your favorite gluten-free recipes and cooking tips', '🍳', '#10b981'),
  ('Product Reviews', 'Review and discuss gluten-free products', '⭐', '#3b82f6'),
  ('Restaurant Finds', 'Share great gluten-free dining experiences', '🍽️', '#f59e0b'),
  ('Health & Wellness', 'Discuss health topics related to gluten-free living', '💪', '#ef4444'),
  ('Travel Tips', 'Tips for gluten-free travel and dining abroad', '✈️', '#8b5cf6'),
  ('Support & Questions', 'Get support and ask questions about gluten-free living', '🤝', '#06b6d4')
) AS new_categories(name, description, icon, color)
WHERE NOT EXISTS (
  SELECT 1 FROM public.community_categories 
  WHERE community_categories.name = new_categories.name
);