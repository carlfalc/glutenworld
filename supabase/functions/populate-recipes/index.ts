import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
}

const sampleRecipes: Recipe[] = [
  // Breakfast Recipes
  {
    title: "Classic Gluten-Free Pancakes",
    original_recipe: "Traditional pancakes with wheat flour",
    converted_recipe: "Made with almond flour and rice flour blend for perfect fluffy texture",
    ingredients: [
      { name: "Almond flour", amount: "1.5", unit: "cups" },
      { name: "Rice flour", amount: "0.5", unit: "cup" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Milk", amount: "1", unit: "cup" },
      { name: "Baking powder", amount: "2", unit: "tsp" },
      { name: "Vanilla extract", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "0.5", unit: "tsp" }
    ],
    instructions: [
      "Mix dry ingredients in a large bowl",
      "Whisk eggs, milk, and vanilla in separate bowl",
      "Combine wet and dry ingredients until just mixed",
      "Cook on griddle until bubbles form, then flip",
      "Serve hot with maple syrup"
    ],
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty_level: "Easy",
    cuisine_type: "American",
    is_public: true,
    calories_per_serving: 285,
    protein_g: 12.5,
    carbs_g: 18.2,
    fat_g: 19.8,
    fiber_g: 4.1,
    sugar_g: 6.3,
    sodium_mg: 380,
    cholesterol_mg: 95,
    image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"
  },
  {
    title: "Quinoa Breakfast Power Bowl",
    original_recipe: "Oat-based breakfast bowl",
    converted_recipe: "Protein-rich quinoa base with fresh fruits and nuts",
    ingredients: [
      { name: "Cooked quinoa", amount: "1", unit: "cup" },
      { name: "Almond milk", amount: "0.5", unit: "cup" },
      { name: "Fresh berries", amount: "0.5", unit: "cup" },
      { name: "Sliced banana", amount: "1", unit: "medium" },
      { name: "Chopped walnuts", amount: "2", unit: "tbsp" },
      { name: "Chia seeds", amount: "1", unit: "tbsp" },
      { name: "Honey", amount: "1", unit: "tbsp" },
      { name: "Cinnamon", amount: "0.5", unit: "tsp" }
    ],
    instructions: [
      "Warm cooked quinoa with almond milk",
      "Add cinnamon and honey",
      "Top with fresh berries and banana",
      "Sprinkle with walnuts and chia seeds",
      "Serve immediately"
    ],
    prep_time: 8,
    cook_time: 5,
    servings: 2,
    difficulty_level: "Easy",
    cuisine_type: "Healthy",
    is_public: true,
    calories_per_serving: 320,
    protein_g: 9.8,
    carbs_g: 52.4,
    fat_g: 9.2,
    fiber_g: 7.6,
    sugar_g: 24.1,
    sodium_mg: 45,
    cholesterol_mg: 0,
    image_url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400"
  },
  // Meat-based Dinner Recipes
  {
    title: "Herb-Crusted Grilled Chicken",
    original_recipe: "Breaded chicken with wheat flour coating",
    converted_recipe: "Aromatic herb crust using almond flour and fresh herbs",
    ingredients: [
      { name: "Chicken breast", amount: "4", unit: "pieces" },
      { name: "Almond flour", amount: "0.5", unit: "cup" },
      { name: "Fresh rosemary", amount: "2", unit: "tbsp" },
      { name: "Fresh thyme", amount: "2", unit: "tbsp" },
      { name: "Garlic powder", amount: "1", unit: "tsp" },
      { name: "Olive oil", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Black pepper", amount: "0.5", unit: "tsp" }
    ],
    instructions: [
      "Preheat grill to medium-high heat",
      "Mix almond flour with herbs and seasonings",
      "Brush chicken with olive oil",
      "Coat chicken with herb mixture",
      "Grill for 6-7 minutes per side until cooked through",
      "Rest for 5 minutes before serving"
    ],
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    difficulty_level: "Medium",
    cuisine_type: "Mediterranean",
    is_public: true,
    calories_per_serving: 285,
    protein_g: 42.3,
    carbs_g: 3.2,
    fat_g: 11.8,
    fiber_g: 1.8,
    sugar_g: 0.8,
    sodium_mg: 615,
    cholesterol_mg: 126,
    image_url: "https://images.unsplash.com/src/assets/herb-crusted-chicken.jpg"
  },
  {
    title: "Beef and Vegetable Stir Fry",
    original_recipe: "Stir fry with soy sauce containing wheat",
    converted_recipe: "Made with gluten-free tamari and fresh vegetables",
    ingredients: [
      { name: "Beef sirloin strips", amount: "1", unit: "lb" },
      { name: "Bell peppers", amount: "2", unit: "large" },
      { name: "Broccoli florets", amount: "2", unit: "cups" },
      { name: "Snap peas", amount: "1", unit: "cup" },
      { name: "Tamari sauce", amount: "3", unit: "tbsp" },
      { name: "Sesame oil", amount: "2", unit: "tbsp" },
      { name: "Fresh ginger", amount: "1", unit: "tbsp" },
      { name: "Garlic cloves", amount: "3", unit: "pieces" }
    ],
    instructions: [
      "Heat oil in large wok or skillet",
      "Stir-fry beef strips until browned",
      "Add vegetables in order of cooking time",
      "Add ginger and garlic",
      "Stir in tamari sauce",
      "Cook until vegetables are crisp-tender"
    ],
    prep_time: 15,
    cook_time: 12,
    servings: 4,
    difficulty_level: "Medium",
    cuisine_type: "Asian",
    is_public: true,
    calories_per_serving: 245,
    protein_g: 28.5,
    carbs_g: 12.8,
    fat_g: 10.2,
    fiber_g: 4.3,
    sugar_g: 8.1,
    sodium_mg: 720,
    cholesterol_mg: 75,
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"
  },
  {
    title: "Gluten-Free Meatballs",
    original_recipe: "Traditional meatballs with breadcrumbs",
    converted_recipe: "Using almond flour and parmesan for binding",
    ingredients: [
      { name: "Ground beef", amount: "1", unit: "lb" },
      { name: "Ground pork", amount: "0.5", unit: "lb" },
      { name: "Almond flour", amount: "0.5", unit: "cup" },
      { name: "Parmesan cheese", amount: "0.25", unit: "cup" },
      { name: "Egg", amount: "1", unit: "large" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Italian seasoning", amount: "1", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Mix all ingredients gently",
      "Form into 20 meatballs",
      "Place on lined baking sheet",
      "Bake for 20-25 minutes",
      "Serve with marinara sauce"
    ],
    prep_time: 20,
    cook_time: 25,
    servings: 5,
    difficulty_level: "Easy",
    cuisine_type: "Italian",
    is_public: true,
    calories_per_serving: 320,
    protein_g: 24.8,
    carbs_g: 4.2,
    fat_g: 22.5,
    fiber_g: 1.5,
    sugar_g: 1.2,
    sodium_mg: 580,
    cholesterol_mg: 105,
    image_url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400"
  }
  // Add more recipes here...
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if recipes already exist to prevent duplicates
    const { data: existingRecipes } = await supabaseClient
      .from('recipes')
      .select('title')
    
    const existingTitles = new Set(existingRecipes?.map(r => r.title) || [])
    const newRecipes = sampleRecipes.filter(recipe => !existingTitles.has(recipe.title))
    
    if (newRecipes.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "All recipes already exist in database",
          count: 0
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Insert only new recipes into database
    const { data, error } = await supabaseClient
      .from('recipes')
      .insert(newRecipes)

    if (error) {
      console.error('Error inserting recipes:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully added ${newRecipes.length} new recipes to database`,
        count: data?.length || 0
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})