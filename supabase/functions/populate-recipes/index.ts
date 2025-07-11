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
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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


// Recipe name lists for AI generation
const recipeNames = {
  Breakfast: [
    "Gluten-Free Blueberry Pancakes", "Quinoa Breakfast Bowl", "Chia Seed Pudding", "Acai Smoothie Bowl", 
    "Vegetable Omelet", "Almond French Toast", "Coconut Granola", "Banana Muffins", "Sweet Potato Waffles",
    "Breakfast Burrito", "Greek Yogurt Parfait", "Overnight Oats", "Scrambled Tofu", "Hash Brown Casserole",
    "Steel Cut Oats", "Avocado Toast", "Breakfast Sandwich", "Protein Smoothie", "Fruit Salad Bowl",
    "Energy Breakfast Bowl", "Gluten-Free Cereal", "Morning Power Wrap", "Breakfast Quesadilla", 
    "Green Smoothie Bowl", "Protein Pancakes", "Buckwheat Porridge", "Breakfast Muffin Cups", 
    "Coconut Yogurt Bowl", "Morning Glory Muffins", "Breakfast Grain Bowl", "Sweet Potato Hash",
    "Quinoa Porridge", "Nut Butter Toast", "Breakfast Parfait", "Morning Smoothie", "Egg Muffins",
    "Breakfast Salad", "Power Bowl", "Morning Wrap", "Breakfast Pizza", "Protein Bowl",
    "Chia Breakfast Bowl", "Morning Oats", "Breakfast Quinoa", "Sweet Breakfast Bowl", "Morning Muffin",
    "Breakfast Smoothie", "Power Pancakes", "Morning Bowl", "Breakfast Bar", "Energy Muffin",
    "Morning Granola", "Breakfast Wrap", "Power Smoothie", "Morning Parfait", "Breakfast Pudding",
    "Energy Bowl", "Morning Toast", "Breakfast Cake", "Power Muffin", "Morning Shake",
    "Breakfast Soup", "Energy Pancakes", "Morning Cookies", "Breakfast Bread", "Power Bowl Special",
    "Morning Energy Bar", "Breakfast Tart", "Power Pudding", "Morning Crackers", "Breakfast Bites",
    "Energy Toast", "Morning Balls", "Breakfast Chips", "Power Granola", "Morning Mix",
    "Breakfast Trail Mix", "Energy Cookies", "Morning Bread", "Breakfast Nuts", "Power Toast",
    "Morning Tart", "Breakfast Crackers", "Energy Bread", "Morning Bites", "Breakfast Mix",
    "Power Cookies", "Morning Chips", "Breakfast Balls", "Energy Mix", "Morning Nuts",
    "Breakfast Seeds", "Power Crackers", "Morning Seeds", "Breakfast Dried Fruit", "Energy Nuts",
    "Morning Jerky", "Breakfast Popcorn", "Power Seeds", "Morning Dried Fruit", "Breakfast Hummus",
    "Energy Jerky", "Morning Popcorn", "Breakfast Dip", "Power Dried Fruit", "Morning Hummus",
    "Breakfast Shake Special", "Energy Popcorn", "Morning Dip", "Breakfast Smoothie Special", "Power Hummus"
  ],
  
  Snacks: [
    "Chocolate Energy Balls", "Mixed Nut Trail Mix", "Almond Protein Bars", "Sweet Potato Chips", 
    "Coconut Date Balls", "Roasted Chickpeas", "Fruit Leather Rolls", "Herb Popcorn", "Avocado Hummus",
    "Spinach Artichoke Dip", "Green Smoothie", "Protein Shake", "Chocolate Bites", "Oatmeal Cookies",
    "Banana Muffins", "Turkey Jerky", "Pumpkin Seeds", "Granola Bars", "Protein Balls", "Kale Chips",
    "Cheese Crisps", "Almond Butter", "Medjool Dates", "Dried Mango", "Spiced Chickpeas",
    "Coconut Chips", "Nut Mix", "Seed Crackers", "Fruit Bites", "Veggie Sticks", "Protein Cookies",
    "Energy Bites", "Trail Mix Bars", "Roasted Nuts", "Dried Fruit Mix", "Savory Popcorn",
    "Hummus Varieties", "Nut Butter Balls", "Seed Mix", "Baked Chips", "Protein Crackers",
    "Energy Cookies", "Trail Cookies", "Nut Cookies", "Seed Cookies", "Fruit Cookies",
    "Veggie Cookies", "Protein Muffins", "Energy Muffins", "Trail Muffins", "Nut Muffins",
    "Seed Muffins", "Fruit Muffins", "Veggie Muffins", "Protein Bars Special", "Energy Bars Special",
    "Trail Bars", "Nut Bars", "Seed Bars", "Fruit Bars", "Veggie Bars",
    "Protein Chips", "Energy Chips", "Trail Chips", "Nut Chips", "Seed Chips",
    "Fruit Chips", "Veggie Chips Special", "Protein Jerky", "Energy Jerky", "Trail Jerky",
    "Nut Jerky", "Seed Jerky", "Fruit Jerky", "Veggie Jerky", "Protein Popcorn",
    "Energy Popcorn", "Trail Popcorn", "Nut Popcorn", "Seed Popcorn", "Fruit Popcorn",
    "Veggie Popcorn", "Protein Hummus", "Energy Hummus", "Trail Hummus", "Nut Hummus",
    "Seed Hummus", "Fruit Hummus", "Veggie Hummus", "Protein Dip", "Energy Dip",
    "Trail Dip", "Nut Dip", "Seed Dip", "Fruit Dip", "Veggie Dip",
    "Protein Smoothie", "Energy Smoothie", "Trail Smoothie", "Nut Smoothie", "Seed Smoothie",
    "Fruit Smoothie", "Veggie Smoothie", "Protein Shake Special", "Energy Shake", "Trail Shake"
  ],
  
  Lunch: [
    "Mediterranean Quinoa Salad", "Asian Chicken Soup", "Turkey Avocado Wrap", "Buddha Bowl", 
    "Gluten-Free Pasta Primavera", "Coconut Rice Bowl", "Vegetable Stir Fry", "Thai Curry", 
    "Fish Tacos", "Chicken Burrito Bowl", "Margherita Pizza", "Turkey Burger", "Naan Flatbread",
    "Pad Thai Noodles", "Mushroom Risotto", "Tuna Casserole", "Stuffed Bell Peppers", "Greek Salad",
    "Poke Bowl", "Grain Bowl", "Lettuce Wraps", "Vietnamese Spring Rolls", "Stuffed Avocado",
    "Chicken Caesar Salad", "Salmon Quinoa Bowl", "Mediterranean Wrap", "Asian Noodle Soup",
    "Mexican Rice Bowl", "Italian Pasta Salad", "Indian Curry Bowl", "Greek Pita Wrap",
    "Thai Soup", "Vietnamese Pho", "Korean Bibimbap", "Japanese Chirashi", "Chinese Fried Rice",
    "American Club Sandwich", "French Onion Soup", "Spanish Paella", "German Schnitzel",
    "Russian Borscht", "Moroccan Tagine", "Ethiopian Injera", "Lebanese Tabbouleh", "Turkish Kebab",
    "Brazilian Feijoada", "Peruvian Ceviche", "Argentine Empanadas", "Chilean Sea Bass", "Colombian Arepa",
    "Venezuelan Cachapa", "Ecuadorian Quinoa Soup", "Bolivian Salteña", "Paraguayan Sopa",
    "Uruguayan Chivito", "Jamaican Jerk Chicken", "Cuban Sandwich", "Puerto Rican Mofongo",
    "Dominican Mangu", "Haitian Griot", "Trinidadian Roti", "Barbadian Flying Fish", "Guyanese Pepperpot",
    "Surinamese Pom", "French Guianese Bouillon", "Brazilian Açaí Bowl", "Peruvian Lomo Saltado",
    "Argentine Milanesa", "Chilean Pastel de Choclo", "Colombian Bandeja Paisa", "Venezuelan Pabellón",
    "Ecuadorian Encebollado", "Bolivian Anticuchos", "Paraguayan Asado", "Uruguayan Parrillada",
    "Jamaican Curry Goat", "Cuban Ropa Vieja", "Puerto Rican Pernil", "Dominican Pollo Guisado",
    "Haitian Tasso", "Trinidadian Pelau", "Barbadian Cou Cou", "Guyanese Cook-up Rice",
    "Surinamese Saoto Soup", "French Guianese Colombo", "Hawaiian Poke", "Californian Cobb Salad",
    "Texan BBQ Brisket", "New York Deli Sandwich", "Chicago Deep Dish", "Philadelphia Cheesesteak",
    "Boston Clam Chowder", "Seattle Salmon", "Portland Food Truck", "Denver Green Chili"
  ],
  
  Dinner: [
    "Herb-Crusted Salmon", "Lemon Garlic Chicken", "Beef Stir Fry", "Pork Tenderloin", 
    "Lamb Chops", "Fish Tacos", "Stuffed Peppers", "Turkey Meatballs", "Roast Beef", 
    "Grilled Turkey Breast", "Shrimp Scampi", "Cod Fillet", "Duck Breast", "Venison Steak",
    "Rabbit Stew", "Bison Burger", "Elk Roast", "Chicken Thighs", "Pork Chops", "Beef Stroganoff",
    "Chicken Curry", "Fish Curry", "Shepherd's Pie", "Braised Short Ribs", "BBQ Ribs",
    "Grilled Salmon", "Roasted Chicken", "Pan-Seared Duck", "Braised Lamb", "Grilled Steak",
    "Baked Cod", "Stuffed Turkey", "Honey Glazed Ham", "Garlic Shrimp", "Blackened Fish",
    "Teriyaki Chicken", "Moroccan Lamb", "Indian Chicken", "Thai Beef", "Chinese Pork",
    "Italian Veal", "French Duck", "Spanish Paella", "German Sauerbraten", "Russian Beef Stroganoff",
    "Greek Moussaka", "Turkish Kebab", "Lebanese Kibbeh", "Moroccan Tagine", "Ethiopian Doro Wat",
    "Indian Biryani", "Thai Green Curry", "Vietnamese Pho", "Korean Bulgogi", "Japanese Teriyaki",
    "Chinese Sweet and Sour", "Filipino Adobo", "Indonesian Rendang", "Malaysian Curry",
    "Singaporean Laksa", "Burmese Mohinga", "Cambodian Amok", "Laotian Larb", "Taiwanese Beef Noodle",
    "Hong Kong Dim Sum", "Macanese Portuguese Chicken", "Australian Meat Pie", "New Zealand Lamb",
    "South African Bobotie", "Nigerian Jollof Rice", "Ghanaian Banku", "Kenyan Nyama Choma",
    "Ethiopian Injera", "Moroccan Couscous", "Egyptian Koshari", "Tunisian Brik", "Algerian Chakhchoukha",
    "Libyan Bazin", "Sudanese Ful Medames", "Somali Anjero", "Djiboutian Skoudehkaris", "Eritrean Zigni",
    "Chad Boule", "Central African Fufu", "Cameroon Ndolé", "Gabon Nyembwe", "Congo Pondu",
    "Angola Muamba", "Namibia Potjiekos", "Botswana Seswaa", "Zimbabwe Sadza", "Zambia Nshima",
    "Malawi Nsima", "Mozambique Matapa", "Madagascar Romazava", "Mauritius Curry", "Seychelles Curry",
    "Comoros Langouste", "Mayotte Pilao", "Réunion Cari", "Brazilian Feijoada", "Argentine Asado",
    "Chilean Empanadas", "Peruvian Ceviche", "Colombian Sancocho", "Venezuelan Arepa", "Ecuadorian Seco",
    "Bolivian Salteña", "Paraguayan Asado", "Uruguayan Chivito", "Guyanese Curry", "Surinamese Pom"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('AI Recipe Generation Started');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to Supabase secrets.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Clear existing recipes first (optional - remove if you want to keep existing)
    logStep('Clearing existing recipes...');
    await supabaseClient.from('recipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const allRecipes: Recipe[] = [];
    let totalGenerated = 0;

    // Generate recipes for each category
    for (const [recipeType, names] of Object.entries(recipeNames)) {
      logStep(`Generating ${names.length} ${recipeType} recipes...`);
      
      // Process in batches to avoid timeouts
      const batchSize = 5;
      for (let i = 0; i < names.length; i += batchSize) {
        const batch = names.slice(i, i + batchSize);
        logStep(`Processing ${recipeType} batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(names.length/batchSize)}`);
        
        // Generate recipes in parallel for each batch
        const batchPromises = batch.map(recipeName => 
          generateAIRecipe(recipeType, recipeName)
        );
        
        try {
          const batchRecipes = await Promise.all(batchPromises);
          allRecipes.push(...batchRecipes);
          totalGenerated += batchRecipes.length;
          logStep(`Generated ${batchRecipes.length} recipes. Total: ${totalGenerated}`);
        } catch (error) {
          logStep(`Error in batch:`, error.message);
          // Continue with next batch even if some fail
        }
      }
    }

    if (allRecipes.length === 0) {
      throw new Error('No recipes were generated successfully');
    }

    // Insert all recipes into database
    logStep(`Inserting ${allRecipes.length} recipes into database...`);
    const { data, error } = await supabaseClient
      .from('recipes')
      .insert(allRecipes);

    if (error) {
      logStep('Database insertion error:', error);
      throw error;
    }

    logStep(`Successfully completed! Generated and inserted ${allRecipes.length} AI-powered recipes`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully generated and added ${allRecipes.length} AI-powered gluten-free recipes`,
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