import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Logging function with timestamp
const logStep = (message: string, ...args: any[]) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, ...args);
};

// Type definitions
interface Recipe {
  title: string;
  original_recipe: string;
  converted_recipe: string;
  ingredients: Array<{name: string, amount: string, unit: string}>;
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty_level: string;
  cuisine_type: string;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg: number;
  dietary_labels: string[];
  is_public?: boolean;
  user_id?: string | null;
  image_url?: string;
}

// AI Recipe Generation Function
const generateAIRecipe = async (recipeType: string, recipeName: string, retryCount = 0): Promise<Recipe> => {
  logStep(`Generating AI recipe for: ${recipeName} (attempt ${retryCount + 1})`);
  
  const openAIApiKey = Deno.env.get('OPENAI') || Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Generate a detailed gluten-free ${recipeType.toLowerCase()} recipe for "${recipeName}". 
  
  IMPORTANT: Respond with ONLY valid JSON in this EXACT format (no markdown, no explanation):
  
  {
    "title": "${recipeName}",
    "original_recipe": "Brief description of traditional version",
    "converted_recipe": "Brief description of gluten-free conversion",
    "ingredients": [
      {"name": "ingredient name", "amount": "1", "unit": "cup"}
    ],
    "instructions": [
      "Step 1 instruction",
      "Step 2 instruction",
      "Step 3 instruction"
    ],
    "prep_time": 15,
    "cook_time": 20,
    "servings": 4,
    "difficulty_level": "Easy",
    "cuisine_type": "${recipeType}",
    "calories_per_serving": 300,
    "protein_g": 15,
    "carbs_g": 30,
    "fat_g": 10,
    "fiber_g": 5,
    "sugar_g": 8,
    "sodium_mg": 400,
    "cholesterol_mg": 50,
    "dietary_labels": ["Gluten-Free"]
  }
  
  Requirements:
  - ALL recipes must be 100% gluten-free (this is mandatory)
  - Analyze ingredients and add appropriate dietary labels from: "Gluten-Free", "Vegan", "Vegetarian", "Dairy-Free", "Nut-Free", "Soy-Free"
  - Always include "Gluten-Free" label for every recipe
  - Add "Vegan" label if no animal products (no meat, dairy, eggs, honey)
  - Add "Vegetarian" label if no meat but may contain dairy/eggs
  - Add "Dairy-Free" label if no dairy products (milk, cheese, butter, etc.)
  - Instructions should be detailed (5-8 steps)
  - Nutritional values should be realistic
  - Use common cooking terms and measurements
  - Recipe should be practical and achievable`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional chef specializing in gluten-free cooking. Return only valid JSON with no additional text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || '60';
        logStep(`Rate limited. Retry after: ${retryAfter} seconds`);
        
        if (retryCount < 3) {
          logStep(`Retrying ${recipeName} after rate limit (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
          return generateAIRecipe(recipeType, recipeName, retryCount + 1);
        }
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Clean up any markdown formatting
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let recipeData: Recipe;
    try {
      recipeData = JSON.parse(cleanContent);
    } catch (parseError) {
      logStep(`JSON parse error for ${recipeName}:`, cleanContent.substring(0, 200));
      
      // If first attempt fails and this is a retry, throw error
      if (retryCount >= 2) {
        throw new Error(`Failed to parse recipe JSON after retries: ${parseError.message}`);
      }
      
      // Retry with a simpler prompt
      logStep(`Retrying ${recipeName} with simpler prompt (attempt ${retryCount + 1})`);
      return generateAIRecipe(recipeType, recipeName, retryCount + 1);
    }
    
    // Add image URL and set as public recipe with null user_id
    const imageId = getImageForRecipe(recipeName, recipeType);
    
    return {
      ...recipeData,
      is_public: true,
      user_id: null, // Explicitly set to null for public AI-generated recipes
      image_url: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop`
    };
    
  } catch (error) {
    logStep(`Error generating recipe for ${recipeName}:`, error.message);
    throw error;
  }
};

// Image mapping function
const getImageForRecipe = (recipeName: string, recipeType: string): string => {
  const name = recipeName.toLowerCase();
  
  // Breakfast images
  if (recipeType === 'Breakfast') {
    if (name.includes('pancake')) return 'photo-1506084868230-bb9d95c24759';
    if (name.includes('waffle')) return 'photo-1562376552-0d160a2f238d';
    if (name.includes('muffin')) return 'photo-1486427944299-d1955d23e34d';
    if (name.includes('smoothie')) return 'photo-1511690656952-34342bb7c2f2';
    if (name.includes('omelette') || name.includes('egg')) return 'photo-1525351484163-7529414344d8';
    if (name.includes('toast')) return 'photo-1484723091739-30a097e8f929';
    if (name.includes('granola')) return 'photo-1525385133512-2f3bdd039054';
    if (name.includes('burrito')) return 'photo-1626700051175-6818013e1d4f';
    return 'photo-1506084868230-bb9d95c24759';
  }
  
  // Snack images
  if (recipeType === 'Snacks') {
    if (name.includes('ball') || name.includes('bite')) return 'photo-1593759608136-45d92d9863c3';
    if (name.includes('trail mix')) return 'photo-1559181567-c3190ca9959b';
    if (name.includes('bar')) return 'photo-1571115764595-644a1f56a55c';
    if (name.includes('hummus') || name.includes('dip')) return 'photo-1568830743174-7a82f0866e8b';
    if (name.includes('chip')) return 'photo-1600952841320-db92ec4047ca';
    if (name.includes('cookie')) return 'photo-1596097477561-a6e0f7574a40';
    return 'photo-1593759608136-45d92d9863c3';
  }
  
  // Lunch images
  if (recipeType === 'Lunch') {
    if (name.includes('salad')) return 'photo-1540420773420-3366772f4999';
    if (name.includes('soup')) return 'photo-1547573854-74d2a71d0826';
    if (name.includes('sandwich')) return 'photo-1509722747041-616f39b57569';
    if (name.includes('wrap')) return 'photo-1544982503-9f984c14501a';
    if (name.includes('pasta')) return 'photo-1621996346565-e3dbc353d2e5';
    if (name.includes('curry')) return 'photo-1631452180519-c014fe946bc7';
    if (name.includes('taco')) return 'photo-1551024506-0bccd828d307';
    if (name.includes('burger')) return 'photo-1520072959219-c595dc870360';
    return 'photo-1540420773420-3366772f4999';
  }
  
  // Dinner images
  if (recipeType === 'Dinner') {
    if (name.includes('chicken')) return 'photo-1598103442097-8b74394b95c6';
    if (name.includes('salmon') || name.includes('fish')) return 'photo-1519708227418-c8fd9a32b7a2';
    if (name.includes('steak') || name.includes('beef')) return 'photo-1546833999-b9f581a1996d';
    if (name.includes('pork')) return 'photo-1529193591184-b1d58069ecdd';
    if (name.includes('lamb')) return 'photo-1546833999-b9f581a1996d';
    if (name.includes('stuffed')) return 'photo-1571091718767-18b5b1457add';
    if (name.includes('ribs')) return 'photo-1529193591184-b1d58069ecdd';
    if (name.includes('shrimp')) return 'photo-1565680018434-b513d5e5fd47';
    return 'photo-1598103442097-8b74394b95c6';
  }
  
  return 'photo-1506084868230-bb9d95c24759';
};

// Recipe name generation function with expanded variety
const generateRecipeNames = (category: string, count: number): string[] => {
  // Expanded recipe bases to ensure 100+ unique base recipes per category
  const bases = {
    Breakfast: [
      // Pancakes (10)
      "Blueberry Pancakes", "Banana Pancakes", "Strawberry Pancakes", "Chocolate Chip Pancakes", "Vanilla Pancakes",
      "Buttermilk Pancakes", "Protein Pancakes", "Oat Pancakes", "Almond Pancakes", "Coconut Pancakes",
      // Waffles (10)
      "Belgian Waffles", "Cinnamon Waffles", "Berry Waffles", "Protein Waffles", "Coconut Waffles",
      "Chocolate Waffles", "Vanilla Waffles", "Banana Waffles", "Pecan Waffles", "Sweet Potato Waffles",
      // Muffins (15)
      "Blueberry Muffins", "Banana Muffins", "Chocolate Muffins", "Lemon Muffins", "Apple Muffins",
      "Cranberry Muffins", "Orange Muffins", "Pumpkin Muffins", "Carrot Muffins", "Zucchini Muffins",
      "Bran Muffins", "Poppy Seed Muffins", "Raspberry Muffins", "Peach Muffins", "Cherry Muffins",
      // Bowls (15)
      "Berry Smoothie Bowl", "Tropical Smoothie Bowl", "Green Smoothie Bowl", "Protein Smoothie Bowl", "Acai Bowl",
      "Granola Bowl", "Quinoa Breakfast Bowl", "Chia Pudding", "Overnight Oats", "Fruit Salad Bowl",
      "Yogurt Parfait", "Power Bowl", "Buddha Bowl", "Breakfast Bowl", "Energy Bowl",
      // Eggs (15)
      "Scrambled Eggs", "Cheese Omelette", "Veggie Omelette", "Herb Omelette", "Spanish Omelette",
      "Mushroom Omelette", "Spinach Omelette", "Western Omelette", "Frittata", "Quiche",
      "Egg Benedict", "Deviled Eggs", "Poached Eggs", "Sunny Side Up", "Egg Sandwich",
      // Toast & Bread (15)
      "Avocado Toast", "Cinnamon Toast", "Banana Toast", "Almond Butter Toast", "Honey Toast",
      "French Toast", "Cream Cheese Toast", "Jam Toast", "Peanut Butter Toast", "Berry Toast",
      "Bagel", "English Muffin", "Breakfast Bread", "Coffee Cake", "Scones",
      // Other Breakfast (20)
      "Breakfast Burrito", "Breakfast Hash", "Breakfast Sandwich", "Breakfast Wrap", "Cereal",
      "Porridge", "Oatmeal", "Grits", "Hash Browns", "Breakfast Pizza",
      "Pancake Bites", "Waffle Bites", "Breakfast Bars", "Granola", "Muesli",
      "Smoothie", "Protein Shake", "Breakfast Cookies", "Danish", "Croissant"
    ],
    Snacks: [
      // Energy Items (20)
      "Energy Balls", "Protein Balls", "Chocolate Balls", "Coconut Balls", "Almond Balls",
      "Date Balls", "Peanut Butter Balls", "Oat Balls", "Chia Balls", "Flax Balls",
      "Protein Bars", "Energy Bars", "Fruit Bars", "Nut Bars", "Chocolate Bars",
      "Granola Bars", "Cereal Bars", "Rice Bars", "Quinoa Bars", "Seed Bars",
      // Mixes (15)
      "Trail Mix", "Nut Mix", "Dried Fruit Mix", "Seed Mix", "Granola Mix",
      "Cereal Mix", "Protein Mix", "Chocolate Mix", "Tropical Mix", "Berry Mix",
      "Spicy Mix", "Sweet Mix", "Crunchy Mix", "Power Mix", "Energy Mix",
      // Dips (15)
      "Hummus Dip", "Veggie Dip", "Bean Dip", "Cheese Dip", "Avocado Dip",
      "Spinach Dip", "Artichoke Dip", "Buffalo Dip", "Ranch Dip", "Salsa Dip",
      "Yogurt Dip", "Tzatziki", "Guacamole", "Queso", "Pesto Dip",
      // Chips (15)
      "Kale Chips", "Sweet Potato Chips", "Beet Chips", "Apple Chips", "Banana Chips",
      "Zucchini Chips", "Carrot Chips", "Parsnip Chips", "Turnip Chips", "Radish Chips",
      "Veggie Chips", "Fruit Chips", "Root Chips", "Herb Chips", "Spiced Chips",
      // Baked Goods (20)
      "Cookies", "Crackers", "Biscuits", "Muffins", "Brownies",
      "Macaroons", "Truffles", "Fudge", "Toffee", "Caramels",
      "Pretzels", "Popcorn", "Rice Cakes", "Corn Cakes", "Oat Cakes",
      "Protein Cookies", "Fruit Cookies", "Nut Cookies", "Seed Cookies", "Spice Cookies",
      // Drinks (15)
      "Smoothie", "Shake", "Juice", "Tea", "Latte",
      "Frappe", "Iced Tea", "Kombucha", "Kefir", "Milk",
      "Protein Drink", "Energy Drink", "Vitamin Water", "Coconut Water", "Herbal Tea"
    ],
    Lunch: [
      // Salads (20)
      "Greek Salad", "Caesar Salad", "Garden Salad", "Quinoa Salad", "Pasta Salad",
      "Potato Salad", "Coleslaw", "Spinach Salad", "Arugula Salad", "Kale Salad",
      "Waldorf Salad", "Cobb Salad", "Nicoise Salad", "Asian Salad", "Mexican Salad",
      "Tuna Salad", "Chicken Salad", "Egg Salad", "Bean Salad", "Fruit Salad",
      // Soups (20)
      "Chicken Soup", "Vegetable Soup", "Lentil Soup", "Tomato Soup", "Mushroom Soup",
      "Minestrone", "Chili", "Stew", "Bisque", "Chowder",
      "Pho", "Ramen", "Miso Soup", "Gazpacho", "Pumpkin Soup",
      "Broccoli Soup", "Carrot Soup", "Onion Soup", "Bean Soup", "Seafood Soup",
      // Sandwiches (20)
      "Turkey Sandwich", "Chicken Sandwich", "Veggie Sandwich", "BLT Sandwich", "Club Sandwich",
      "Grilled Cheese", "Panini", "Sub", "Hoagie", "Melt",
      "Reuben", "Monte Cristo", "Po'boy", "Banh Mi", "Cubano",
      "Philly Cheesesteak", "Italian Sub", "Meatball Sub", "Tuna Melt", "Egg Salad Sandwich",
      // Wraps (15)
      "Chicken Wrap", "Turkey Wrap", "Veggie Wrap", "Tuna Wrap", "Salmon Wrap",
      "Ham Wrap", "Beef Wrap", "Egg Wrap", "Cheese Wrap", "Hummus Wrap",
      "Buffalo Wrap", "Caesar Wrap", "Greek Wrap", "Asian Wrap", "Mexican Wrap",
      // Pasta & Grains (15)
      "Pasta Primavera", "Chicken Pasta", "Seafood Pasta", "Veggie Pasta", "Pesto Pasta",
      "Alfredo Pasta", "Carbonara", "Lasagna", "Ravioli", "Gnocchi",
      "Rice Bowl", "Quinoa Bowl", "Grain Bowl", "Pilaf", "Risotto",
      // International (10)
      "Chicken Curry", "Vegetable Curry", "Thai Curry", "Indian Curry", "Coconut Curry",
      "Fish Tacos", "Chicken Tacos", "Beef Tacos", "Veggie Tacos", "Shrimp Tacos"
    ],
    Dinner: [
      // Chicken (20)
      "Grilled Chicken", "Roasted Chicken", "Baked Chicken", "Fried Chicken", "BBQ Chicken",
      "Teriyaki Chicken", "Lemon Chicken", "Herb Chicken", "Stuffed Chicken", "Blackened Chicken",
      "Honey Chicken", "Garlic Chicken", "Parmesan Chicken", "Buffalo Chicken", "Cajun Chicken",
      "Mediterranean Chicken", "Asian Chicken", "Mexican Chicken", "Indian Chicken", "Thai Chicken",
      // Fish & Seafood (20)
      "Grilled Salmon", "Baked Salmon", "Pan Seared Salmon", "Teriyaki Salmon", "Lemon Salmon",
      "Cedar Plank Salmon", "Glazed Salmon", "Smoked Salmon", "Poached Salmon", "Cajun Salmon",
      "Grilled Shrimp", "Garlic Shrimp", "Coconut Shrimp", "Spicy Shrimp", "Lemon Shrimp",
      "Crab Cakes", "Lobster Tail", "Scallops", "Fish Tacos", "Fish & Chips",
      // Beef (20)
      "Beef Steak", "Grilled Steak", "Ribeye Steak", "Sirloin Steak", "Filet Mignon",
      "T-Bone Steak", "Strip Steak", "Flank Steak", "Skirt Steak", "Round Steak",
      "Beef Roast", "Pot Roast", "Beef Stew", "Beef Stroganoff", "Beef Bourguignon",
      "Meatloaf", "Meatballs", "Beef Tacos", "Beef Curry", "Beef Stir Fry",
      // Pork (20)
      "Pork Chops", "Grilled Pork", "Roasted Pork", "BBQ Pork", "Pork Tenderloin",
      "Pork Shoulder", "Pork Ribs", "Pork Loin", "Pork Belly", "Pulled Pork",
      "Ham", "Bacon", "Sausage", "Bratwurst", "Chorizo",
      "Pork Stir Fry", "Pork Curry", "Carnitas", "Pork Schnitzel", "Pork Medallions",
      // Stuffed Vegetables (10)
      "Stuffed Peppers", "Stuffed Zucchini", "Stuffed Mushrooms", "Stuffed Tomatoes", "Stuffed Squash",
      "Stuffed Eggplant", "Stuffed Cabbage", "Stuffed Portobello", "Stuffed Artichokes", "Stuffed Onions",
      // Lamb & Other (10)
      "Lamb Chops", "Roasted Lamb", "Grilled Lamb", "Mediterranean Lamb", "Herb Crusted Lamb",
      "Duck Breast", "Venison", "Turkey Breast", "Cornish Hen", "Prime Rib"
    ]
  };

  const categoryBases = bases[category as keyof typeof bases] || bases.Breakfast;
  const recipes: string[] = [];
  
  // Generate exactly 'count' unique recipe names
  for (let i = 0; i < count; i++) {
    const baseIndex = i % categoryBases.length;
    const base = categoryBases[baseIndex];
    
    // Create variations using different prefixes/styles
    const variations = [
      `Gluten-Free ${base}`,
      `Classic ${base}`,
      `Homemade ${base}`,
      `Healthy ${base}`,
      `Traditional ${base}`,
      `Gourmet ${base}`,
      `Easy ${base}`,
      `Quick ${base}`,
      `Deluxe ${base}`,
      `Premium ${base}`
    ];
    
    const variationIndex = Math.floor(i / categoryBases.length);
    if (variationIndex < variations.length) {
      recipes.push(variations[variationIndex]);
    } else {
      // If we need even more variations, add numbered styles
      const styleNum = (variationIndex - variations.length) + 1;
      recipes.push(`Gluten-Free ${base} Style ${styleNum}`);
    }
  }
  
  return recipes;
};

// Background recipe generation function with improved timeout handling
const generateRecipesInBackground = async (progressId: string) => {
  const startTime = Date.now();
  const MAX_EXECUTION_TIME = 28 * 60 * 1000; // 28 minutes - safe buffer
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const updateProgress = async (updates: any) => {
    await supabaseClient
      .from('recipe_generation_progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', progressId);
  };

  const shouldStop = () => {
    return (Date.now() - startTime) > MAX_EXECUTION_TIME;
  };

  try {
    logStep('Starting background recipe generation...');
    await updateProgress({ status: 'running' });

    // Get current progress to continue from where we left off
    const { data: currentProgress } = await supabaseClient
      .from('recipe_generation_progress')
      .select('*')
      .eq('id', progressId)
      .single();

    let totalGenerated = currentProgress?.generated_recipes || 0;
    const currentCategory = currentProgress?.current_category;

    logStep(`Current progress: ${totalGenerated}/400 recipes, last category: ${currentCategory}`);

    // Check existing recipes count
    const { data: existingRecipes } = await supabaseClient
      .from('recipes')
      .select('cuisine_type')
      .is('user_id', null)
      .eq('is_public', true);
    
    const existingByCategory = (existingRecipes || []).reduce((acc, recipe) => {
      acc[recipe.cuisine_type] = (acc[recipe.cuisine_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    logStep('Existing recipes by category:', existingByCategory);

    const categories = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];
    
    // Start from the current category or the first incomplete one
    let startCategoryIndex = 0;
    if (currentCategory) {
      startCategoryIndex = categories.indexOf(currentCategory);
    }

    for (let catIndex = startCategoryIndex; catIndex < categories.length; catIndex++) {
      if (shouldStop()) {
        logStep('⏰ Timeout approaching, stopping gracefully...');
        await updateProgress({ 
          status: 'timeout_restart_needed',
          error_message: `Generation paused at ${totalGenerated} recipes due to timeout. Will auto-restart.`
        });
        return;
      }

      const category = categories[catIndex];
      const existingInCategory = existingByCategory[category] || 0;
      
      if (existingInCategory >= 100) {
        logStep(`✓ ${category} already complete (${existingInCategory}/100)`);
        continue;
      }

      logStep(`\n=== Processing ${category} Category (${existingInCategory}/100 existing) ===`);
      await updateProgress({ current_category: category });
      
      const recipesToGenerate = 100 - existingInCategory;
      const categoryNames = generateRecipeNames(category, recipesToGenerate);
      let categoryGenerated = 0;
      
      // Smaller batches for better progress tracking and error recovery
      const batchSize = 2;
      
      for (let i = 0; i < categoryNames.length; i += batchSize) {
        if (shouldStop()) {
          logStep('⏰ Timeout approaching during batch processing...');
          await updateProgress({ 
            status: 'timeout_restart_needed',
            generated_recipes: totalGenerated,
            error_message: `Generation paused at ${totalGenerated} recipes due to timeout. Will auto-restart.`
          });
          return;
        }

        const batch = categoryNames.slice(i, i + batchSize);
        const batchNum = Math.floor(i/batchSize) + 1;
        const totalBatches = Math.ceil(categoryNames.length/batchSize);
        
        logStep(`Batch ${batchNum}/${totalBatches} for ${category}: ${batch.join(', ')}`);
        
        try {
          // Generate recipes sequentially to avoid rate limits
          const validRecipes = [];
          for (const recipeName of batch) {
            try {
              const recipe = await generateAIRecipe(category, recipeName);
              if (recipe) {
                validRecipes.push(recipe);
                logStep(`✓ Generated: ${recipeName}`);
              }
            } catch (error) {
              logStep(`✗ Failed to generate ${recipeName}: ${error.message}`);
              // Continue with next recipe
            }
            
            // Small delay between individual recipes
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Insert valid recipes to database
          if (validRecipes.length > 0) {
            const recipesToInsert = validRecipes.map(recipe => ({
              ...recipe,
              user_id: null,
              is_public: true
            }));
            
            const { error: insertError } = await supabaseClient
              .from('recipes')
              .insert(recipesToInsert);
            
            if (insertError) {
              logStep(`Database insert error:`, insertError.message);
            } else {
              categoryGenerated += validRecipes.length;
              totalGenerated += validRecipes.length;
              
              // Update progress after each successful batch
              await updateProgress({ generated_recipes: totalGenerated });
              
              logStep(`✅ Batch complete: +${validRecipes.length} recipes. Total: ${totalGenerated}/400`);
            }
          }
          
          // Longer pause between batches to avoid rate limits
          if (i + batchSize < categoryNames.length) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          
        } catch (batchError) {
          logStep(`Batch error:`, batchError.message);
          // Continue with next batch after a pause
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      logStep(`✓ ${category} category complete: generated ${categoryGenerated} new recipes`);
      
      // Pause between categories
      if (catIndex < categories.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Final verification
    const { data: finalCount } = await supabaseClient
      .from('recipes')
      .select('id', { count: 'exact' })
      .is('user_id', null)
      .eq('is_public', true);

    const finalTotal = finalCount?.length || 0;

    logStep(`\n🎉 GENERATION COMPLETE: ${finalTotal} total recipes in database`);

    await updateProgress({ 
      status: 'completed',
      generated_recipes: finalTotal,
      completed_at: new Date().toISOString(),
      error_message: null
    });

  } catch (error) {
    logStep('💥 Background generation error:', error.message, error.stack);
    
    await updateProgress({ 
      status: 'failed',
      error_message: `Generation failed: ${error.message}`
    });
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('AI Recipe Generation Request Received');
    
    const openAIApiKey = Deno.env.get('OPENAI') || Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      logStep('OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add OPENAI or OPENAI_API_KEY to Supabase secrets.',
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if generation is already in progress or completed
    const { data: existingProgress } = await supabaseClient
      .from('recipe_generation_progress')
      .select('*')
      .in('status', ['pending', 'running', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingProgress) {
      if (existingProgress.status === 'completed') {
        // Check how many recipes actually exist
        const { data: recipeCount } = await supabaseClient
          .from('recipes')
          .select('id', { count: 'exact' })
          .is('user_id', null)
          .eq('is_public', true);

        const totalRecipes = recipeCount?.length || 0;
        
        // Only return as completed if we actually have 400 recipes
        if (totalRecipes >= 400) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `Recipes already generated! Found ${totalRecipes} AI-generated recipes.`,
              already_completed: true,
              total_in_database: totalRecipes,
              progress_id: existingProgress.id
            }),
            { 
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          // Reset progress to continue generation
          await supabaseClient
            .from('recipe_generation_progress')
            .update({ 
              status: 'timeout_restart_needed',
              generated_recipes: totalRecipes,
              error_message: `Found ${totalRecipes}/400 recipes. Continuing generation...`,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingProgress.id);
          
          logStep(`Found incomplete generation: ${totalRecipes}/400 recipes. Restarting...`);
        }
      } else if (existingProgress.status === 'running' || existingProgress.status === 'pending') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Recipe generation already in progress! Generated ${existingProgress.generated_recipes}/400 recipes.`,
            already_running: true,
            progress: existingProgress,
            progress_id: existingProgress.id
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Create new progress entry
    const { data: progressEntry, error: progressError } = await supabaseClient
      .from('recipe_generation_progress')
      .insert({
        user_id: null, // Global generation for all users
        status: 'pending',
        total_recipes: 400,
        generated_recipes: 0
      })
      .select()
      .single();

    if (progressError || !progressEntry) {
      throw new Error('Failed to create progress tracking entry');
    }

    // Start background generation using EdgeRuntime.waitUntil
    EdgeRuntime.waitUntil(generateRecipesInBackground(progressEntry.id));

    logStep(`Started background recipe generation with progress ID: ${progressEntry.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Recipe generation started in background! You can navigate away and check back later.',
        started_in_background: true,
        progress_id: progressEntry.id,
        check_progress_tip: 'The progress will be tracked and recipes will continue generating even if you navigate away.'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    logStep('Function error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
