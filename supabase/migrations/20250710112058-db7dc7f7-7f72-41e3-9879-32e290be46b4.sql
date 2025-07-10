-- Update Herb-Crusted Pork Tenderloin with specific ingredients and instructions
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "lb", "name": "Pork tenderloin, trimmed"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh rosemary, chopped"},
    {"amount": "2", "unit": "tbsp", "name": "Fresh thyme, chopped"},
    {"amount": "3", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "cup", "name": "Baby carrots"},
    {"amount": "1", "unit": "cup", "name": "Brussels sprouts, halved"},
    {"amount": "1", "unit": "cup", "name": "Sweet potatoes, cubed"},
    {"amount": "3", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Salt"},
    {"amount": "1/2", "unit": "tsp", "name": "Black pepper"},
    {"amount": "1", "unit": "tsp", "name": "Paprika"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 425°F (220°C)',
    'Mix rosemary, thyme, garlic, salt, pepper, and paprika with 1 tbsp olive oil to create herb crust',
    'Rub herb mixture all over pork tenderloin, coating evenly',
    'Toss vegetables with remaining olive oil and season with salt and pepper',
    'Place pork on baking sheet and arrange vegetables around it',
    'Roast for 25-30 minutes until internal temperature reaches 145°F (63°C)',
    'Let pork rest 5 minutes before slicing',
    'Serve sliced pork with roasted vegetables and enjoy!'
  ]
WHERE title ILIKE '%herb-crusted%pork%tenderloin%' OR title ILIKE '%herb%crusted%pork%';

-- Update Stuffed Bell Peppers with specific ingredients and instructions  
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "4", "unit": "large", "name": "Red bell peppers, tops cut and seeds removed"},
    {"amount": "1", "unit": "lb", "name": "Ground turkey (93% lean)"},
    {"amount": "1", "unit": "cup", "name": "Cooked quinoa"},
    {"amount": "1", "unit": "medium", "name": "Yellow onion, diced"},
    {"amount": "2", "unit": "cloves", "name": "Garlic, minced"},
    {"amount": "1", "unit": "can", "name": "Diced tomatoes (14.5 oz)"},
    {"amount": "1", "unit": "cup", "name": "Corn kernels"},
    {"amount": "1/2", "unit": "cup", "name": "Black beans, rinsed"},
    {"amount": "1", "unit": "cup", "name": "Gluten-free cheese, shredded"},
    {"amount": "2", "unit": "tbsp", "name": "Olive oil"},
    {"amount": "1", "unit": "tsp", "name": "Cumin"},
    {"amount": "1", "unit": "tsp", "name": "Chili powder"},
    {"amount": "1/2", "unit": "tsp", "name": "Salt"},
    {"amount": "1/4", "unit": "tsp", "name": "Black pepper"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 375°F (190°C)',
    'Cut tops off bell peppers and remove seeds and membranes',
    'If needed, trim bottom slightly so peppers stand upright',
    'Heat olive oil in large skillet over medium-high heat',
    'Add diced onion and cook 3-4 minutes until softened',
    'Add garlic and ground turkey, cook 6-8 minutes breaking up meat',
    'Stir in diced tomatoes, corn, black beans, cumin, chili powder, salt, and pepper',
    'Add cooked quinoa and mix well, cook 2-3 minutes more',
    'Stuff each pepper with turkey mixture, packing gently',
    'Place stuffed peppers in baking dish with 1/4 inch water in bottom',
    'Cover with foil and bake 35-40 minutes until peppers are tender',
    'Remove foil, top each pepper with shredded cheese',
    'Bake uncovered 5-10 minutes until cheese melts',
    'Let cool 5 minutes before serving with fresh cilantro if desired'
  ]
WHERE title ILIKE '%stuffed%bell%pepper%' OR title ILIKE '%stuffed%pepper%';

-- Update Chocolate Energy Balls with specific ingredients and instructions
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "cup", "name": "Medjool dates, pitted"},
    {"amount": "1/2", "unit": "cup", "name": "Raw almonds"},
    {"amount": "1/4", "unit": "cup", "name": "Unsweetened cocoa powder"},
    {"amount": "2", "unit": "tbsp", "name": "Chia seeds"},
    {"amount": "2", "unit": "tbsp", "name": "Ground flaxseed"},
    {"amount": "1", "unit": "tsp", "name": "Vanilla extract"},
    {"amount": "1/4", "unit": "tsp", "name": "Sea salt"},
    {"amount": "2", "unit": "tbsp", "name": "Mini dark chocolate chips (dairy-free)"},
    {"amount": "2", "unit": "tbsp", "name": "Shredded coconut (for rolling)"}
  ]'::jsonb,
  instructions = ARRAY[
    'Soak dates in warm water for 10 minutes if they are dry',
    'Add almonds to food processor and pulse until roughly chopped',
    'Add drained dates, cocoa powder, chia seeds, flaxseed, vanilla, and salt',
    'Process until mixture forms a sticky paste that holds together when squeezed',
    'Fold in chocolate chips by hand',
    'Scoop mixture into 1-inch balls using small cookie scoop or hands',
    'Roll balls in shredded coconut if desired',
    'Place on parchment-lined plate and refrigerate 30 minutes to firm up',
    'Store in refrigerator up to 1 week or freeze up to 3 months'
  ]
WHERE title ILIKE '%chocolate%energy%ball%';

-- Update remaining chocolate recipes with unique variations
UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "cup", "name": "Raw cashews"},
    {"amount": "1/2", "unit": "cup", "name": "Dried cranberries"},
    {"amount": "1/4", "unit": "cup", "name": "Dark chocolate chunks"},
    {"amount": "2", "unit": "tbsp", "name": "Pumpkin seeds"},
    {"amount": "2", "unit": "tbsp", "name": "Sunflower seeds"},
    {"amount": "1", "unit": "tsp", "name": "Cinnamon"},
    {"amount": "1/4", "unit": "tsp", "name": "Sea salt"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 300°F (150°C)',
    'Spread cashews on baking sheet and toast 8-10 minutes',
    'Let cashews cool completely',
    'Mix toasted cashews with cranberries, chocolate chunks, and seeds',
    'Sprinkle with cinnamon and sea salt, toss to combine',
    'Store in airtight container up to 2 weeks',
    'Perfect for hiking, snacking, or lunch boxes'
  ]
WHERE title ILIKE '%chocolate%trail%mix%';

UPDATE recipes 
SET 
  ingredients = '[
    {"amount": "1", "unit": "cup", "name": "Almond flour"},
    {"amount": "1/4", "unit": "cup", "name": "Cocoa powder"},
    {"amount": "2", "unit": "tbsp", "name": "Coconut flour"},
    {"amount": "1/4", "unit": "cup", "name": "Maple syrup"},
    {"amount": "2", "unit": "tbsp", "name": "Coconut oil, melted"},
    {"amount": "1", "unit": "tsp", "name": "Vanilla extract"},
    {"amount": "1/2", "unit": "tsp", "name": "Baking soda"},
    {"amount": "1/4", "unit": "tsp", "name": "Salt"},
    {"amount": "2", "unit": "tbsp", "name": "Dark chocolate chips"}
  ]'::jsonb,
  instructions = ARRAY[
    'Preheat oven to 350°F (175°C) and line baking sheet with parchment',
    'Whisk together almond flour, cocoa powder, coconut flour, baking soda, and salt',
    'In separate bowl, mix maple syrup, melted coconut oil, and vanilla',
    'Combine wet and dry ingredients until dough forms',
    'Fold in chocolate chips',
    'Roll dough into small balls and flatten on baking sheet',
    'Bake 10-12 minutes until edges are set',
    'Cool on baking sheet 5 minutes before transferring to wire rack',
    'Store in airtight container up to 1 week'
  ]
WHERE title ILIKE '%chocolate%cracker%';