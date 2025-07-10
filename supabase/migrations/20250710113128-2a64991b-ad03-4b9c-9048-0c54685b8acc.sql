-- Continue updating remaining recipes with specific ingredients and detailed instructions

-- Fish/Seafood recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1.5", "unit": "lbs", "name": "White fish fillets (cod, halibut, or mahi-mahi)"},
    {"amount": "2", "unit": "medium", "name": "Limes, juiced and zested"},
    {"amount": "1", "unit": "large", "name": "Red onion, thinly sliced"},
    {"amount": "2", "unit": "medium", "name": "Tomatoes, diced"},
    {"amount": "1", "unit": "medium", "name": "Cucumber, diced"},
    {"amount": "1", "unit": "jalapeño", "name": "Jalapeño pepper, seeded and minced"},
    {"amount": "1/4", "unit": "cup", "name": "Fresh cilantro, chopped"},
    {"amount": "2", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Sea salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Cut fish into 1/2 inch cubes and place in glass bowl',
    'Pour lime juice over fish, ensuring all pieces are covered',
    'Add lime zest and salt, toss gently to combine',
    'Refrigerate 30-45 minutes until fish appears opaque',
    'Add diced tomatoes, cucumber, red onion, and jalapeño',
    'Drizzle with olive oil and add fresh cilantro',
    'Season with additional salt and pepper to taste',
    'Let marinate 15 minutes more before serving',
    'Serve chilled with gluten-free crackers or lettuce cups'
  ]
WHERE title ILIKE '%fish%' AND ingredients::text LIKE '%Nuts%';

-- Pasta/Noodle recipes 
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "lb", "name": "Gluten-free pasta (penne or rotini)"},
    {"amount": "2", "unit": "medium", "name": "Zucchini, spiralized or julienned"},
    {"amount": "1", "unit": "pint", "name": "Cherry tomatoes, halved"},
    {"amount": "1/2", "unit": "cup", "name": "Sun-dried tomatoes, chopped"},
    {"amount": "4", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1/4", "unit": "cup", "name": "Fresh basil, chopped"},
    {"amount": "1/4", "unit": "cup", "name": "Pine nuts, toasted"},
    {"amount": "1/3", "unit": "cup", "name": "Olive oil"},
    {"amount": "1/2", "unit": "cup", "name": "Dairy-free parmesan cheese"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Red pepper flakes"}
  ]'::jsonb,
  instructions = ARRAY[
    'Cook gluten-free pasta according to package directions until al dente',
    'Reserve 1 cup pasta water before draining',
    'Heat olive oil in large skillet over medium heat',
    'Add garlic and cook 1 minute until fragrant',
    'Add cherry tomatoes and sun-dried tomatoes, cook 3-4 minutes',
    'Add zucchini noodles and cook 2-3 minutes until tender',
    'Add drained pasta and toss with vegetables',
    'Add pasta water gradually until desired consistency reached',
    'Stir in fresh basil, pine nuts, and dairy-free cheese',
    'Season with salt and red pepper flakes, serve immediately'
  ]
WHERE title ILIKE '%pasta%' OR title ILIKE '%noodle%' AND ingredients::text LIKE '%Nuts%';

-- Vegetarian/Vegan recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "can", "name": "Chickpeas, drained and rinsed (15 oz)"},
    {"amount": "1", "unit": "large", "name": "Sweet potato, cubed"},
    {"amount": "1", "unit": "medium", "name": "Red bell pepper, chopped"},
    {"amount": "1", "unit": "medium", "name": "Yellow onion, diced"},
    {"amount": "3", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "can", "name": "Coconut milk (14 oz)"},
    {"amount": "1", "unit": "can", "name": "Diced tomatoes (14.5 oz)"},
    {"amount": "2", "unit": "tbsp", "name": "Curry powder"},
    {"amount": "1", "unit": "tbsp", "name": "Fresh ginger, grated"},
    {"amount": "2", "unit": "tbsp", "name": "Coconut oil"},
    {"amount": "1", "unit": "tsp", "name": "Turmeric"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/4", "unit": "cup", "name": "Fresh cilantro, chopped"}
  ]'::jsonb,
  instructions = ARRAY[
    'Heat coconut oil in large pot over medium heat',
    'Add diced onion and cook 4-5 minutes until softened',
    'Add garlic, ginger, curry powder, and turmeric, cook 1 minute',
    'Add cubed sweet potato and bell pepper, stir to coat with spices',
    'Pour in coconut milk and diced tomatoes with juices',
    'Add chickpeas and salt, bring to a boil',
    'Reduce heat and simmer 20-25 minutes until sweet potatoes are tender',
    'Taste and adjust seasoning with salt and curry powder',
    'Garnish with fresh cilantro before serving',
    'Serve over cauliflower rice or with gluten-free naan'
  ]
WHERE (title ILIKE '%vegetarian%' OR title ILIKE '%vegan%' OR title ILIKE '%plant%') AND ingredients::text LIKE '%Nuts%';

-- Soup recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "2", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "large", "name": "Yellow onion, diced"},
    {"amount": "3", "unit": "stalks", "name": "Celery, chopped"},
    {"amount": "2", "unit": "large", "name": "Carrots, sliced"},
    {"amount": "3", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "8", "unit": "cups", "name": "Gluten-free vegetable broth"},
    {"amount": "1", "unit": "can", "name": "Diced tomatoes (14.5 oz)"},
    {"amount": "1", "unit": "cup", "name": "Green beans, trimmed and cut"},
    {"amount": "1", "unit": "cup", "name": "Corn kernels"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh parsley, chopped"},
    {"amount": "1", "unit": "tbsp", "name": "Fresh thyme"},
    {"amount": "2", "unit": "bay leaves"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Heat olive oil in large soup pot over medium heat',
    'Add onion, celery, and carrots, cook 6-8 minutes until softened',
    'Add garlic and cook 1 minute until fragrant',
    'Pour in vegetable broth and diced tomatoes with juices',
    'Add bay leaves, thyme, salt, and pepper',
    'Bring to a boil, then reduce heat and simmer 15 minutes',
    'Add green beans and corn, cook 10-12 minutes more',
    'Remove bay leaves and taste for seasoning',
    'Stir in fresh parsley just before serving',
    'Serve hot with gluten-free crackers or bread'
  ]
WHERE title ILIKE '%soup%' AND ingredients::text LIKE '%Nuts%';

-- Salad recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "6", "unit": "cups", "name": "Mixed greens (spinach, arugula, romaine)"},
    {"amount": "1", "unit": "cup", "name": "Cherry tomatoes, halved"},
    {"amount": "1", "unit": "medium", "name": "Cucumber, sliced"},
    {"amount": "1/2", "unit": "cup", "name": "Red onion, thinly sliced"},
    {"amount": "1/2", "unit": "cup", "name": "Avocado, diced"},
    {"amount": "1/4", "unit": "cup", "name": "Pumpkin seeds, toasted"},
    {"amount": "1/4", "unit": "cup", "name": "Dried cranberries"},
    {"amount": "3", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "2", "unit": "tbsp", "name": "Balsamic vinegar"},
    {"amount": "1", "unit": "tbsp", "name": "Dijon mustard"},
    {"amount": "1", "unit": "tsp", "name": "Honey or maple syrup"},
    {"amount": "1/2", "unit": "tsp", "name": "Salt"},
    {"amount": "1/4", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Wash and dry mixed greens thoroughly',
    'Combine greens, cherry tomatoes, cucumber, and red onion in large bowl',
    'Whisk together olive oil, balsamic vinegar, Dijon mustard, and honey',
    'Season dressing with salt and pepper, whisk until emulsified',
    'Add diced avocado to salad just before serving',
    'Drizzle dressing over salad and toss gently to coat',
    'Top with toasted pumpkin seeds and dried cranberries',
    'Serve immediately while greens are crisp',
    'Perfect as side dish or add grilled protein for main course'
  ]
WHERE title ILIKE '%salad%' AND ingredients::text LIKE '%Nuts%';