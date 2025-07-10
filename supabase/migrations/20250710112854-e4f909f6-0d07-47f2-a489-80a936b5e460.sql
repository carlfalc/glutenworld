-- Update all remaining recipes with specific ingredients and detailed instructions

-- Chicken recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "4", "unit": "pieces", "name": "Chicken breast, boneless skinless"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh herbs (rosemary, thyme, oregano)"},
    {"amount": "1", "unit": "medium", "name": "Lemon, juiced and zested"},
    {"amount": "3", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "2", "unit": "cups", "name": "Mixed vegetables (broccoli, carrots, bell peppers)"},
    {"amount": "3", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"},
    {"amount": "1", "unit": "tsp", "name": "Garlic powder"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 400°F (200°C)',
    'Season chicken breasts with salt, pepper, and garlic powder',
    'Heat 2 tbsp olive oil in oven-safe skillet over medium-high heat',
    'Sear chicken 3-4 minutes per side until golden brown',
    'Add minced garlic and fresh herbs to pan, cook 30 seconds',
    'Add lemon juice and zest, toss vegetables with remaining oil',
    'Transfer skillet to oven, bake 15-20 minutes until chicken reaches 165°F',
    'Let chicken rest 5 minutes before slicing',
    'Serve with roasted vegetables and pan juices'
  ]
WHERE title ILIKE '%chicken%' AND ingredients::text LIKE '%Nuts%';

-- Salmon recipes  
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "4", "unit": "fillets", "name": "Salmon fillets (6 oz each)"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh dill, chopped"},
    {"amount": "1", "unit": "large", "name": "Lemon, sliced"},
    {"amount": "2", "unit": "tbsp", "name": "Capers"},
    {"amount": "1", "unit": "lb", "name": "Asparagus, trimmed"},
    {"amount": "1", "unit": "cup", "name": "Cherry tomatoes, halved"},
    {"amount": "3", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "2", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "tsp", "name": "Sea salt"},
    {"amount": "1/2", "unit": "tsp", "name": "White pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 425°F (220°C)',
    'Line baking sheet with parchment paper',
    'Pat salmon fillets dry and season with salt and pepper',
    'Toss asparagus and tomatoes with 2 tbsp olive oil and garlic',
    'Place vegetables on one side of baking sheet',
    'Brush salmon with remaining oil and top with dill and capers',
    'Add lemon slices on top of salmon',
    'Bake 12-15 minutes until salmon flakes easily',
    'Serve immediately with lemon wedges'
  ]
WHERE title ILIKE '%salmon%' AND ingredients::text LIKE '%Nuts%';

-- Beef recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1.5", "unit": "lbs", "name": "Beef sirloin, cut into strips"},
    {"amount": "2", "unit": "tbsp", "name": "Coconut aminos (gluten-free soy sauce alternative)"},
    {"amount": "1", "unit": "tbsp", "name": "Fresh ginger, grated"},
    {"amount": "2", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "large", "name": "Bell pepper, sliced"},
    {"amount": "1", "unit": "medium", "name": "Onion, sliced"},
    {"amount": "1", "unit": "cup", "name": "Snap peas"},
    {"amount": "2", "unit": "tbsp", "name": "Avocado oil"},
    {"amount": "1", "unit": "tsp", "name": "Sesame oil"},
    {"amount": "1", "unit": "tbsp", "name": "Rice vinegar"},
    {"amount": "1", "unit": "tsp", "name": "Red pepper flakes"}
  ]'::jsonb,
  instructions = ARRAY[
    'Marinate beef strips in coconut aminos, ginger, and garlic for 15 minutes',
    'Heat avocado oil in large wok or skillet over high heat',
    'Add marinated beef and stir-fry 3-4 minutes until browned',
    'Remove beef and set aside',
    'Add onions and bell peppers, stir-fry 2-3 minutes',
    'Add snap peas and cook 1-2 minutes more',
    'Return beef to pan with sesame oil and rice vinegar',
    'Toss everything together and cook 1 minute',
    'Sprinkle with red pepper flakes and serve over cauliflower rice'
  ]
WHERE title ILIKE '%beef%' AND ingredients::text LIKE '%Nuts%';

-- Lamb recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "8", "unit": "pieces", "name": "Lamb chops (1 inch thick)"},
    {"amount": "3", "unit": "tbsp", "name": "Fresh rosemary, chopped"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh mint, chopped"},
    {"amount": "4", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "cup", "name": "Red wine"},
    {"amount": "2", "unit": "tbsp", "name": "Balsamic vinegar"},
    {"amount": "1", "unit": "lb", "name": "Baby potatoes, halved"},
    {"amount": "1", "unit": "bunch", "name": "Green beans, trimmed"},
    {"amount": "3", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Let lamb chops come to room temperature 30 minutes before cooking',
    'Mix rosemary, mint, garlic, salt, and pepper with 2 tbsp olive oil',
    'Rub herb mixture all over lamb chops and marinate 15 minutes',
    'Preheat grill or grill pan to medium-high heat',
    'Toss potatoes and green beans with remaining oil',
    'Grill lamb chops 3-4 minutes per side for medium-rare',
    'Let lamb rest while vegetables finish cooking',
    'Deglaze pan with red wine and balsamic vinegar',
    'Serve lamb with vegetables and reduced wine sauce'
  ]
WHERE title ILIKE '%lamb%' AND ingredients::text LIKE '%Nuts%';

-- Turkey recipes
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "2", "unit": "lbs", "name": "Ground turkey (93% lean)"},
    {"amount": "1", "unit": "large", "name": "Yellow onion, diced"},
    {"amount": "2", "unit": "stalks", "name": "Celery, diced"},
    {"amount": "2", "unit": "medium", "name": "Carrots, diced"},
    {"amount": "3", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "can", "name": "Crushed tomatoes (28 oz)"},
    {"amount": "2", "unit": "cups", "name": "Gluten-free chicken broth"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh oregano"},
    {"amount": "1", "unit": "tbsp", "name": "Fresh basil"},
    {"amount": "2", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Heat olive oil in large Dutch oven over medium heat',
    'Add diced onion, celery, and carrots, cook 5-6 minutes',
    'Add garlic and cook 1 minute until fragrant',
    'Add ground turkey, breaking up with spoon, cook 8-10 minutes',
    'Season with salt, pepper, oregano, and basil',
    'Add crushed tomatoes and chicken broth',
    'Bring to boil, then reduce heat and simmer 20-25 minutes',
    'Taste and adjust seasoning as needed',
    'Serve hot with gluten-free bread or over zucchini noodles'
  ]
WHERE title ILIKE '%turkey%' AND ingredients::text LIKE '%Nuts%';