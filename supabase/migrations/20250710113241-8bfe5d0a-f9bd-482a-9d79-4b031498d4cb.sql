-- Final batch - update all remaining recipes that still have generic ingredients

-- Update any remaining recipes with generic "Nuts", "Dates", "Seeds" ingredients
UPDATE recipes 
SET 
  ingredients = CASE 
    WHEN title ILIKE '%breakfast%' OR title ILIKE '%granola%' OR title ILIKE '%oat%' THEN 
      '[
        {"amount": "2", "unit": "cups", "name": "Gluten-free rolled oats"},
        {"amount": "1/2", "unit": "cup", "name": "Mixed nuts (almonds, walnuts, pecans)"},
        {"amount": "1/4", "unit": "cup", "name": "Pumpkin seeds"},
        {"amount": "1/4", "unit": "cup", "name": "Sunflower seeds"},
        {"amount": "1/3", "unit": "cup", "name": "Pure maple syrup"},
        {"amount": "1/4", "unit": "cup", "name": "Coconut oil, melted"},
        {"amount": "1", "unit": "tsp", "name": "Vanilla extract"},
        {"amount": "1", "unit": "tsp", "name": "Cinnamon"},
        {"amount": "1/2", "unit": "tsp", "name": "Sea salt"},
        {"amount": "1/2", "unit": "cup", "name": "Dried fruit (cranberries, raisins)"}
      ]'::jsonb
    WHEN title ILIKE '%smoothie%' OR title ILIKE '%shake%' THEN
      '[
        {"amount": "1", "unit": "cup", "name": "Frozen mixed berries"},
        {"amount": "1", "unit": "large", "name": "Banana, frozen"},
        {"amount": "1", "unit": "cup", "name": "Coconut milk, canned"},
        {"amount": "2", "unit": "tbsp", "name": "Almond butter"},
        {"amount": "1", "unit": "tbsp", "name": "Chia seeds"},
        {"amount": "1", "unit": "tsp", "name": "Vanilla extract"},
        {"amount": "1", "unit": "tbsp", "name": "Maple syrup"},
        {"amount": "1/2", "unit": "cup", "name": "Ice cubes"},
        {"amount": "1", "unit": "tbsp", "name": "Protein powder (optional)"}
      ]'::jsonb
    WHEN title ILIKE '%dessert%' OR title ILIKE '%sweet%' OR title ILIKE '%cake%' THEN
      '[
        {"amount": "2", "unit": "cups", "name": "Almond flour"},
        {"amount": "1/2", "unit": "cup", "name": "Coconut flour"},
        {"amount": "3/4", "unit": "cup", "name": "Coconut sugar"},
        {"amount": "3", "unit": "large", "name": "Eggs"},
        {"amount": "1/2", "unit": "cup", "name": "Coconut oil, melted"},
        {"amount": "1", "unit": "tsp", "name": "Vanilla extract"},
        {"amount": "1", "unit": "tsp", "name": "Baking soda"},
        {"amount": "1/2", "unit": "tsp", "name": "Salt"},
        {"amount": "1/2", "unit": "cup", "name": "Dark chocolate chips (dairy-free)"}
      ]'::jsonb
    ELSE 
      '[
        {"amount": "1", "unit": "lb", "name": "Protein of choice (chicken, fish, or tofu)"},
        {"amount": "2", "unit": "cups", "name": "Fresh seasonal vegetables"},
        {"amount": "2", "unit": "tbsp", "name": "Fresh herbs (parsley, cilantro, basil)"},
        {"amount": "3", "unit": "tbsp", "name": "Olive oil or avocado oil"},
        {"amount": "2", "unit": "cloves", "name": "Garlic, minced"},
        {"amount": "1", "unit": "medium", "name": "Lemon or lime, juiced"},
        {"amount": "1", "unit": "tsp", "name": "Sea salt"},
        {"amount": "1/2", "unit": "tsp", "name": "Black pepper"},
        {"amount": "1", "unit": "tsp", "name": "Spice blend (paprika, cumin, or herbs)"}
      ]'::jsonb
  END,
  instructions = CASE 
    WHEN title ILIKE '%breakfast%' OR title ILIKE '%granola%' OR title ILIKE '%oat%' THEN 
      ARRAY[
        'Preheat oven to 325°F (165°C)',
        'Mix oats, nuts, and seeds in large bowl',
        'Whisk together maple syrup, melted coconut oil, vanilla, cinnamon, and salt',
        'Pour wet ingredients over dry and stir until evenly coated',
        'Spread mixture on parchment-lined baking sheet',
        'Bake 20-25 minutes, stirring halfway through, until golden brown',
        'Let cool completely on baking sheet (it will crisp up as it cools)',
        'Stir in dried fruit once cooled',
        'Store in airtight container up to 2 weeks'
      ]
    WHEN title ILIKE '%smoothie%' OR title ILIKE '%shake%' THEN
      ARRAY[
        'Add frozen berries and banana to high-speed blender',
        'Pour in coconut milk and add almond butter',
        'Add chia seeds, vanilla extract, and maple syrup',
        'Add protein powder if using',
        'Blend on high 60-90 seconds until completely smooth',
        'Add ice cubes and blend 30 seconds more for thicker consistency',
        'Taste and adjust sweetness with more maple syrup if needed',
        'Pour into glasses and serve immediately',
        'Garnish with fresh berries or coconut flakes if desired'
      ]
    WHEN title ILIKE '%dessert%' OR title ILIKE '%sweet%' OR title ILIKE '%cake%' THEN
      ARRAY[
        'Preheat oven to 350°F (175°C) and line pan with parchment',
        'Whisk together almond flour, coconut flour, baking soda, and salt',
        'In separate bowl, beat eggs with coconut sugar until light',
        'Add melted coconut oil and vanilla to egg mixture',
        'Gradually fold in dry ingredients until just combined',
        'Fold in chocolate chips gently',
        'Pour batter into prepared pan and smooth top',
        'Bake 25-30 minutes until toothpick inserted comes out clean',
        'Cool in pan 10 minutes before removing to wire rack'
      ]
    ELSE 
      ARRAY[
        'Prepare protein by cutting into appropriate serving sizes',
        'Season protein with salt, pepper, and chosen spice blend',
        'Heat oil in large skillet or grill pan over medium-high heat',
        'Cook protein according to type (chicken 6-8 min per side, fish 4-5 min)',
        'Remove protein and set aside to rest',
        'Add vegetables to same pan with garlic',
        'Sauté vegetables 5-7 minutes until tender-crisp',
        'Add fresh herbs and lemon/lime juice',
        'Return protein to pan briefly to warm through',
        'Serve immediately with fresh herbs as garnish'
      ]
  END
WHERE ingredients::text LIKE '%Nuts%' OR ingredients::text LIKE '%Dates%' OR ingredients::text LIKE '%Seeds%';