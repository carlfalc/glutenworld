import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[POPULATE-RECIPES] ${step}${detailsStr}`);
};

interface Recipe {
  title: string;
  original_recipe: string;
  converted_recipe: string;
  ingredients: any;
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty_level: string;
  cuisine_type: string;
  is_public: boolean;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg: number;
  image_url: string;
  dietary_labels: string[];
}

// AI-powered recipe generation function
const generateAIRecipe = async (recipeType: string, recipeName: string): Promise<Recipe> => {
  logStep(`Generating AI recipe for: ${recipeName}`);
  
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
          { 
            role: 'system', 
            content: 'You are a professional gluten-free chef. Generate complete, detailed recipes with accurate nutritional information. Respond only with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      logStep(`OpenAI API error: ${response.status}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const recipeData = JSON.parse(result.choices[0].message.content);
    
    // Add image URL and public flag
    const imageId = getImageForRecipe(recipeName, recipeType);
    
    return {
      ...recipeData,
      is_public: true,
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
    if (name.includes('beef') || name.includes('steak')) return 'photo-1546833999-b9f581a1996d';
    if (name.includes('pork') || name.includes('lamb')) return 'photo-1588168333986-5078d3ae3976';
    if (name.includes('stuffed')) return 'photo-1571997478779-2adcbbe9ab2f';
    if (name.includes('ribs')) return 'photo-1544025162-d76694265947';
    if (name.includes('shrimp')) return 'photo-1615141982883-c7ad0e69fd62';
    return 'photo-1603894584373-5ac82b2ae398';
  }
  
  return 'photo-1506084868230-bb9d95c24759'; // default
};


// Recipe name lists for AI generation - 100 RECIPES PER CATEGORY
const generateRecipeNames = (category: string, count: number): string[] => {
  const bases = {
    Breakfast: [
      "Blueberry Pancakes", "Banana Pancakes", "Strawberry Pancakes", "Chocolate Chip Pancakes", "Vanilla Pancakes",
      "Belgian Waffles", "Cinnamon Waffles", "Berry Waffles", "Protein Waffles", "Coconut Waffles",
      "Blueberry Muffins", "Banana Muffins", "Chocolate Muffins", "Lemon Muffins", "Apple Muffins",
      "Berry Smoothie Bowl", "Tropical Smoothie Bowl", "Green Smoothie Bowl", "Protein Smoothie Bowl", "Acai Bowl",
      "Scrambled Eggs", "Cheese Omelette", "Veggie Omelette", "Herb Omelette", "Spanish Omelette",
      "Avocado Toast", "Cinnamon Toast", "Banana Toast", "Almond Butter Toast", "Honey Toast",
      "Granola Bowl", "Quinoa Breakfast Bowl", "Chia Pudding", "Overnight Oats", "Breakfast Burrito",
      "French Toast", "Breakfast Hash", "Egg Benedict", "Breakfast Sandwich", "Fruit Salad"
    ],
    Snacks: [
      "Energy Balls", "Protein Balls", "Chocolate Balls", "Coconut Balls", "Almond Balls",
      "Trail Mix", "Nut Mix", "Dried Fruit Mix", "Seed Mix", "Granola Mix",
      "Protein Bars", "Energy Bars", "Fruit Bars", "Nut Bars", "Chocolate Bars",
      "Hummus Dip", "Veggie Dip", "Bean Dip", "Cheese Dip", "Avocado Dip",
      "Kale Chips", "Sweet Potato Chips", "Beet Chips", "Apple Chips", "Banana Chips",
      "Cookies", "Crackers", "Biscuits", "Muffins", "Brownies",
      "Smoothie", "Shake", "Juice", "Tea", "Latte"
    ],
    Lunch: [
      "Greek Salad", "Caesar Salad", "Garden Salad", "Quinoa Salad", "Pasta Salad",
      "Chicken Soup", "Vegetable Soup", "Lentil Soup", "Tomato Soup", "Mushroom Soup",
      "Turkey Sandwich", "Chicken Sandwich", "Veggie Sandwich", "BLT Sandwich", "Club Sandwich",
      "Chicken Wrap", "Turkey Wrap", "Veggie Wrap", "Tuna Wrap", "Salmon Wrap",
      "Pasta Primavera", "Chicken Pasta", "Seafood Pasta", "Veggie Pasta", "Pesto Pasta",
      "Chicken Curry", "Vegetable Curry", "Thai Curry", "Indian Curry", "Coconut Curry",
      "Fish Tacos", "Chicken Tacos", "Beef Tacos", "Veggie Tacos", "Shrimp Tacos",
      "Veggie Burger", "Turkey Burger", "Salmon Burger", "Black Bean Burger", "Quinoa Burger"
    ],
    Dinner: [
      "Grilled Chicken", "Roasted Chicken", "Baked Chicken", "Fried Chicken", "BBQ Chicken",
      "Grilled Salmon", "Baked Salmon", "Pan Seared Salmon", "Teriyaki Salmon", "Lemon Salmon",
      "Beef Steak", "Grilled Steak", "Ribeye Steak", "Sirloin Steak", "Filet Mignon",
      "Pork Chops", "Grilled Pork", "Roasted Pork", "BBQ Pork", "Pork Tenderloin",
      "Stuffed Peppers", "Stuffed Zucchini", "Stuffed Mushrooms", "Stuffed Tomatoes", "Stuffed Squash",
      "BBQ Ribs", "Beef Ribs", "Pork Ribs", "Spare Ribs", "Short Ribs",
      "Grilled Shrimp", "Garlic Shrimp", "Coconut Shrimp", "Spicy Shrimp", "Lemon Shrimp",
      "Lamb Chops", "Roasted Lamb", "Grilled Lamb", "Mediterranean Lamb", "Herb Crusted Lamb"
    ]
  };

  const categoryBases = bases[category as keyof typeof bases] || bases.Breakfast;
  const recipes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseIndex = i % categoryBases.length;
    const base = categoryBases[baseIndex];
    const variation = Math.floor(i / categoryBases.length) + 1;
    
    if (variation === 1) {
      recipes.push(`Gluten-Free ${base}`);
    } else {
      recipes.push(`Gluten-Free ${base} (Style ${variation})`);
    }
  }
  
  return recipes;
};

const recipeNames = {
  Breakfast: generateRecipeNames('Breakfast', 100),
  Snacks: generateRecipeNames('Snacks', 100),
  Lunch: generateRecipeNames('Lunch', 100),
  Dinner: generateRecipeNames('Dinner', 100)
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('AI Recipe Generation Started');
    
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
    )

    // Skip clearing existing recipes to prevent data loss
    logStep('Keeping existing recipes and adding new ones...');

    const allRecipes: Recipe[] = [];
    let totalGenerated = 0;

    // Generate recipes for each category
    for (const [recipeType, names] of Object.entries(recipeNames)) {
      logStep(`Generating ${names.length} ${recipeType} recipes...`);
      
      // Process in smaller batches to reduce timeout risk
      const batchSize = 5;
      for (let i = 0; i < names.length; i += batchSize) {
        const batch = names.slice(i, i + batchSize);
        logStep(`Processing ${recipeType} batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(names.length/batchSize)} - Items ${i + 1} to ${Math.min(i + batchSize, names.length)}`);
        
        // Generate recipes sequentially to avoid rate limits
        const batchRecipes = [];
        for (const recipeName of batch) {
          try {
            const recipe = await generateAIRecipe(recipeType, recipeName);
            batchRecipes.push(recipe);
            logStep(`✓ Generated recipe: ${recipeName}`);
            
            // Add small delay between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            logStep(`✗ Error generating ${recipeName}:`, error.message);
            // Continue with next recipe instead of stopping
          }
        }
        
        if (batchRecipes.length > 0) {
          allRecipes.push(...batchRecipes);
          totalGenerated += batchRecipes.length;
          logStep(`✓ Batch complete! Generated ${batchRecipes.length} recipes. Total: ${totalGenerated}/${names.length * Object.keys(recipeNames).length}`);
          
          // Insert batch immediately to prevent loss
          try {
            const { error: insertError } = await supabaseClient
              .from('recipes')
              .insert(batchRecipes, { ignoreDuplicates: true });
            
            if (insertError) {
              logStep(`Insert error for batch:`, insertError.message);
            } else {
              logStep(`✓ Successfully inserted ${batchRecipes.length} recipes to database`);
            }
          } catch (insertErr) {
            logStep(`Database insert failed:`, insertErr.message);
          }
        }
        
        // Longer delay between batches to ensure stability
        if (i + batchSize < names.length) {
          logStep(`Waiting before next batch...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      logStep(`✓ Completed ${recipeType} category: ${totalGenerated} total recipes generated`);
    }

    if (allRecipes.length === 0) {
      throw new Error('No recipes were generated successfully');
    }

    logStep(`Successfully completed! Generated ${allRecipes.length} recipes across all categories`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully generated ${allRecipes.length} AI-powered gluten-free recipes`,
        breakdown: {
          breakfast: recipeNames.Breakfast.length,
          snacks: recipeNames.Snacks.length,
          lunch: recipeNames.Lunch.length,
          dinner: recipeNames.Dinner.length
        },
        total_generated: allRecipes.length
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

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
    )
  }
})