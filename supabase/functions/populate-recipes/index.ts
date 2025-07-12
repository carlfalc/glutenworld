import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Recipe type definition
interface Recipe {
  title: string;
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty_level: 'Easy' | 'Medium' | 'Hard';
  cuisine_type: string;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg: number;
  image_url: string;
  is_public: boolean;
  user_id: null;
  dietary_labels: string[];
}

// Generate a single AI recipe using OpenAI
async function generateAIRecipe(recipeType: string, recipeName: string, retryCount = 0): Promise<Recipe> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Generate a detailed gluten-free ${recipeType.toLowerCase()} recipe for "${recipeName}". 

CRITICAL REQUIREMENTS:
- The recipe MUST be completely gluten-free (no wheat, barley, rye, or standard flour)
- Use gluten-free alternatives like rice flour, almond flour, quinoa flour, etc.
- Include exact measurements and clear instructions
- All ingredients must be naturally gluten-free or certified gluten-free substitutes

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Recipe name",
  "ingredients": [{"name": "ingredient name", "amount": "1", "unit": "cup"}],
  "instructions": ["Step 1", "Step 2"],
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "difficulty_level": "Easy",
  "cuisine_type": "${recipeType}",
  "calories_per_serving": 350,
  "protein_g": 12,
  "carbs_g": 45,
  "fat_g": 8,
  "fiber_g": 3,
  "sugar_g": 6,
  "sodium_mg": 400,
  "cholesterol_mg": 0,
  "dietary_labels": ["Gluten-Free"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef specializing in gluten-free cuisine. Generate only valid JSON responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        console.log(`Rate limited, retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateAIRecipe(recipeType, recipeName, retryCount + 1);
      }
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    let recipeData;
    try {
      recipeData = JSON.parse(content);
    } catch (parseError) {
      if (retryCount < 2) {
        console.log(`JSON parse error, retrying... (attempt ${retryCount + 1})`);
        return generateAIRecipe(recipeType, recipeName, retryCount + 1);
      }
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`);
    }

    // Add the required fields that aren't in the OpenAI response
    const recipe: Recipe = {
      ...recipeData,
      image_url: getImageForRecipe(recipeName, recipeType),
      is_public: true,
      user_id: null,
      dietary_labels: ['Gluten-Free', ...(recipeData.dietary_labels || [])].filter((label, index, arr) => arr.indexOf(label) === index)
    };

    return recipe;
  } catch (error) {
    console.error('Error generating AI recipe:', error);
    throw error;
  }
}

// Map recipe names to image IDs
function getImageForRecipe(recipeName: string, recipeType: string): string {
  const imageMap: Record<string, string> = {
    // Add more mappings as needed
    'chicken': 'herb-crusted-chicken.jpg',
    'bell pepper': 'stuffed-bell-peppers.jpg',
    'default': 'herb-crusted-chicken.jpg'
  };

  const lowerName = recipeName.toLowerCase();
  for (const [key, image] of Object.entries(imageMap)) {
    if (lowerName.includes(key)) {
      return `/lovable-uploads/${image}`;
    }
  }

  return `/lovable-uploads/${imageMap.default}`;
}

// Generate recipe names for different categories
function generateRecipeNames(category: string, count: number): string[] {
  const recipesByCategory: Record<string, string[]> = {
    'Breakfast': [
      'Gluten-Free Pancakes', 'Quinoa Breakfast Bowl', 'Coconut Flour Muffins',
      'Almond Flour Waffles', 'Chia Seed Pudding', 'Rice Flour Crepes'
    ],
    'Lunch': [
      'Quinoa Salad Bowl', 'Rice Paper Spring Rolls', 'Lettuce Wrap Tacos',
      'Zucchini Noodle Pasta', 'Stuffed Bell Peppers', 'Cauliflower Rice Bowl'
    ],
    'Dinner': [
      'Herb Crusted Chicken', 'Salmon with Quinoa', 'Rice Flour Crusted Fish',
      'Stuffed Portobello Mushrooms', 'Coconut Curry Chicken', 'Almond Crusted Pork'
    ],
    'Dessert': [
      'Coconut Flour Cookies', 'Almond Flour Brownies', 'Rice Flour Cake',
      'Chia Seed Pudding', 'Coconut Ice Cream', 'Gluten-Free Pie'
    ]
  };

  const baseNames = recipesByCategory[category] || recipesByCategory['Dinner'];
  const names: string[] = [];

  // Generate unique names by combining base names with variations
  const variations = ['Classic', 'Spicy', 'Herb', 'Mediterranean', 'Asian-Style', 'Rustic'];
  
  for (let i = 0; i < count; i++) {
    const baseName = baseNames[i % baseNames.length];
    const variation = variations[Math.floor(i / baseNames.length) % variations.length];
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    names.push(`${variation} ${baseName} ${timestamp}_${randomId}`);
  }

  return names;
}

// Background recipe generation function - SIMPLIFIED AND FIXED
async function generateRecipesInBackground(progressId: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  console.log(`=== STARTING BACKGROUND GENERATION FOR PROGRESS ID: ${progressId} ===`);

  try {
    // Force update status to running
    await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?id=eq.${progressId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        status: 'running',
        current_category: 'Starting generation...',
        updated_at: new Date().toISOString()
      })
    });

    // Get current count of existing recipes
    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/recipes?user_id=is.null&is_public=eq.true&select=id`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      }
    });
    
    let generatedCount = 0;
    if (existingResponse.ok) {
      const existingRecipes = await existingResponse.json();
      generatedCount = existingRecipes.length;
      console.log(`Found ${generatedCount} existing recipes, continuing from there...`);
    }

    // Get target recipes from progress entry
    const progressResponse = await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?id=eq.${progressId}&select=total_recipes`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      }
    });
    
    let totalRecipes = 400; // default
    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      if (progressData.length > 0) {
        totalRecipes = progressData[0].total_recipes;
      }
    }
    
    console.log(`Target: ${totalRecipes} recipes (currently have ${generatedCount})`);
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];

    // Generate recipes until we reach target
    while (generatedCount < totalRecipes) {
      const category = categories[generatedCount % categories.length];
      
      console.log(`=== Generating recipe ${generatedCount + 1}/${totalRecipes} in category: ${category} ===`);
      
      // Update progress
      await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?id=eq.${progressId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify({
          current_category: `${category} (${generatedCount + 1}/${totalRecipes})`,
          generated_recipes: generatedCount,
          updated_at: new Date().toISOString()
        })
      });

      // Generate unique recipe name with better uniqueness
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 100000);
      const baseNames = generateRecipeNames(category, 1);
      const recipeName = `${baseNames[0]}_${timestamp}_${randomId}`;

      try {
        console.log(`Generating: ${recipeName}`);
        const recipe = await generateAIRecipe(category, recipeName);

        // Make title even more unique to avoid duplicates
        const uniqueTitle = `${recipe.title}_${timestamp}_${randomId}`;
        recipe.title = uniqueTitle;

        // Insert recipe with retry on duplicate
        let insertSuccess = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!insertSuccess && retryCount < maxRetries) {
          const insertResponse = await fetch(`${supabaseUrl}/rest/v1/recipes`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
            },
            body: JSON.stringify(recipe)
          });

          if (insertResponse.ok) {
            generatedCount++;
            console.log(`✓ SUCCESS: Recipe ${generatedCount}/${totalRecipes} created: ${recipe.title}`);
            insertSuccess = true;
          } else {
            const errorText = await insertResponse.text();
            if (errorText.includes('unique_recipe_title') && retryCount < maxRetries - 1) {
              // Duplicate title, modify and retry
              retryCount++;
              const newTimestamp = Date.now();
              const newRandomId = Math.floor(Math.random() * 100000);
              recipe.title = `${recipe.title}_retry${retryCount}_${newTimestamp}_${newRandomId}`;
              console.log(`Duplicate title detected, retrying with: ${recipe.title}`);
            } else {
              console.error(`✗ FAILED to insert recipe after ${retryCount + 1} attempts: ${insertResponse.status} - ${errorText}`);
              break;
            }
          }
        }

        // Reduced delay for faster generation
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`✗ ERROR generating recipe "${recipeName}":`, error);
        // Continue with next recipe - don't let one failure stop everything
      }
    }

    // Mark as completed
    console.log(`=== GENERATION COMPLETE! Generated ${generatedCount} recipes ===`);
    await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?id=eq.${progressId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        status: 'completed',
        generated_recipes: generatedCount,
        completed_at: new Date().toISOString(),
        current_category: 'Completed',
        updated_at: new Date().toISOString()
      })
    });

  } catch (error) {
    console.error('=== BACKGROUND GENERATION ERROR ===', error);
    
    // Mark as failed
    await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?id=eq.${progressId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        status: 'failed',
        error_message: error.message || 'Unknown error',
        updated_at: new Date().toISOString()
      })
    });
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Populate recipes function called');

    // Check for existing progress to get target
    let targetRecipes = 400; // default
    const progressCheckResponse = await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?order=created_at.desc&limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      }
    });
    
    if (progressCheckResponse.ok) {
      const progressData = await progressCheckResponse.json();
      if (progressData.length > 0) {
        targetRecipes = progressData[0].total_recipes;
      }
    }

    // Check if we already have target recipes
    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/recipes?user_id=is.null&is_public=eq.true&select=id`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      }
    });

    if (existingResponse.ok) {
      const existingRecipes = await existingResponse.json();
      if (existingRecipes.length >= targetRecipes) {
        return new Response(
          JSON.stringify({
            already_completed: true,
            message: `Recipe generation already completed! Found ${existingRecipes.length} recipes in the database (target: ${targetRecipes}).`,
            total_in_database: existingRecipes.length,
            target: targetRecipes
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    // Check for existing progress
    const progressResponse = await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress?status=in.(pending,running,timeout_restart_needed)&order=created_at.desc&limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      }
    });

    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      if (progressData.length > 0) {
        const progress = progressData[0];
        
        if (progress.status === 'running' || progress.status === 'pending') {
          return new Response(
            JSON.stringify({
              already_running: true,
              message: `Recipe generation is already in progress. Generated ${progress.generated_recipes}/${progress.total_recipes} recipes.`,
              progress: progress,
              progress_id: progress.id
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        }

        if (progress.status === 'timeout_restart_needed') {
          // Continue from existing progress
          EdgeRuntime.waitUntil(generateRecipesInBackground(progress.id));
          
          return new Response(
            JSON.stringify({
              started_in_background: true,
              message: `Continuing recipe generation from ${progress.generated_recipes}/400 recipes...`,
              progress_id: progress.id
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        }
      }
    }

    // Create new progress entry
    const newProgressResponse = await fetch(`${supabaseUrl}/rest/v1/recipe_generation_progress`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        status: 'pending',
        total_recipes: targetRecipes,
        generated_recipes: 0,
        current_category: 'Starting',
        started_at: new Date().toISOString()
      })
    });

    if (!newProgressResponse.ok) {
      throw new Error('Failed to create progress entry');
    }

    const progressData = await newProgressResponse.json();
    const progressId = progressData[0].id;

    // Start background generation
    EdgeRuntime.waitUntil(generateRecipesInBackground(progressId));

    return new Response(
      JSON.stringify({
        started_in_background: true,
        message: `Recipe generation started in the background! This will take about ${Math.ceil(targetRecipes * 0.5)} minutes to generate ${targetRecipes} recipes.`,
        progress_id: progressId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in populate-recipes function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Failed to start recipe generation'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});