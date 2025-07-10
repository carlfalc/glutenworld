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

const generateBreakfastRecipes = (): Recipe[] => {
  const breakfastBases = [
    "Gluten-Free Pancakes", "Quinoa Bowl", "Chia Pudding", "Smoothie Bowl", "Omelette", "French Toast", 
    "Granola", "Muffins", "Waffles", "Breakfast Burrito", "Yogurt Parfait", "Overnight Oats", "Scrambled Eggs",
    "Breakfast Hash", "Porridge", "Toast", "Breakfast Sandwich", "Cereal Bowl", "Fruit Bowl", "Protein Bowl",
    "Breakfast Pizza", "Breakfast Quesadilla", "Morning Wrap", "Breakfast Salad", "Energy Balls"
  ];
  
  const variations = ["Classic", "Chocolate", "Berry", "Tropical", "Vanilla", "Cinnamon"];
  const modifiers = ["Power", "Protein", "Healthy", "Deluxe"];
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = breakfastBases[i % breakfastBases.length];
    const variation = variations[Math.floor(i / breakfastBases.length) % variations.length];
    const modifier = modifiers[Math.floor(i / (breakfastBases.length * variations.length)) % modifiers.length];
    
    return {
      title: `${variation} ${modifier} ${base}`,
      original_recipe: `Traditional ${base.toLowerCase()}`,
      converted_recipe: `Gluten-free version with enhanced nutrition`,
      ingredients: [
        { name: "Gluten-free flour blend", amount: "1", unit: "cup" },
        { name: "Eggs", amount: "2", unit: "large" },
        { name: "Milk", amount: "1", unit: "cup" },
        { name: "Sugar", amount: "2", unit: "tbsp" }
      ],
      instructions: ["Mix ingredients", "Cook until done", "Serve hot"],
      prep_time: 10 + (i % 5),
      cook_time: 15 + (i % 10),
      servings: 2 + (i % 4),
      difficulty_level: ["Easy", "Medium", "Hard"][i % 3],
      cuisine_type: "Breakfast",
      is_public: true,
      calories_per_serving: 250 + (i % 100),
      protein_g: 8 + (i % 15),
      carbs_g: 30 + (i % 20),
      fat_g: 8 + (i % 12),
      fiber_g: 3 + (i % 8),
      sugar_g: 5 + (i % 15),
      sodium_mg: 300 + (i % 200),
      cholesterol_mg: 50 + (i % 100),
      image_url: `https://images.unsplash.com/photo-${1567620905732 + i}?w=400`
    };
  });
};

const generateSnackRecipes = (): Recipe[] => {
  const snackBases = [
    "Energy Balls", "Trail Mix", "Crackers", "Bars", "Chips", "Nuts", "Fruit Leather", "Popcorn",
    "Hummus", "Dip", "Smoothie", "Shake", "Bites", "Cookies", "Muffins", "Jerky", "Seeds",
    "Granola Bars", "Protein Balls", "Veggie Chips", "Cheese Crisps", "Nut Butter", "Dates",
    "Dried Fruit", "Roasted Chickpeas"
  ];
  
  const flavors = ["Chocolate", "Vanilla", "Berry", "Coconut", "Almond", "Peanut"];
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = snackBases[i % snackBases.length];
    const flavor = flavors[Math.floor(i / snackBases.length) % flavors.length];
    
    return {
      title: `${flavor} ${base}`,
      original_recipe: `Traditional ${base.toLowerCase()}`,
      converted_recipe: `Gluten-free healthy snack option`,
      ingredients: [
        { name: "Nuts", amount: "1", unit: "cup" },
        { name: "Dates", amount: "0.5", unit: "cup" },
        { name: "Seeds", amount: "2", unit: "tbsp" }
      ],
      instructions: ["Combine ingredients", "Form into balls", "Chill until set"],
      prep_time: 5 + (i % 10),
      cook_time: 0,
      servings: 1 + (i % 3),
      difficulty_level: ["Easy", "Medium"][i % 2],
      cuisine_type: "Snacks",
      is_public: true,
      calories_per_serving: 150 + (i % 80),
      protein_g: 5 + (i % 10),
      carbs_g: 15 + (i % 15),
      fat_g: 8 + (i % 8),
      fiber_g: 3 + (i % 5),
      sugar_g: 8 + (i % 12),
      sodium_mg: 50 + (i % 150),
      cholesterol_mg: 0,
      image_url: `https://images.unsplash.com/photo-${1511690743698 + i}?w=400`
    };
  });
};

const generateLunchRecipes = (): Recipe[] => {
  const lunchBases = [
    "Salad", "Soup", "Sandwich", "Wrap", "Bowl", "Pasta", "Rice Dish", "Stir Fry", "Curry",
    "Tacos", "Burrito", "Pizza", "Burger", "Flatbread", "Noodles", "Risotto", "Casserole",
    "Stuffed Peppers", "Quinoa Salad", "Buddha Bowl", "Poke Bowl", "Grain Bowl", "Lettuce Wraps",
    "Spring Rolls", "Stuffed Avocado"
  ];
  
  const proteins = ["Chicken", "Turkey", "Salmon", "Tuna", "Tofu", "Tempeh"];
  const styles = ["Mediterranean", "Asian", "Mexican", "Italian"];
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = lunchBases[i % lunchBases.length];
    const protein = proteins[Math.floor(i / lunchBases.length) % proteins.length];
    const style = styles[Math.floor(i / (lunchBases.length * proteins.length)) % styles.length];
    
    return {
      title: `${style} ${protein} ${base}`,
      original_recipe: `Traditional ${base.toLowerCase()}`,
      converted_recipe: `Gluten-free lunch with balanced nutrition`,
      ingredients: [
        { name: protein, amount: "6", unit: "oz" },
        { name: "Vegetables", amount: "2", unit: "cups" },
        { name: "Gluten-free grains", amount: "0.5", unit: "cup" },
        { name: "Olive oil", amount: "1", unit: "tbsp" }
      ],
      instructions: ["Prepare protein", "Sauté vegetables", "Combine with grains", "Season and serve"],
      prep_time: 15 + (i % 10),
      cook_time: 20 + (i % 15),
      servings: 2 + (i % 3),
      difficulty_level: ["Easy", "Medium", "Hard"][i % 3],
      cuisine_type: "Lunch",
      is_public: true,
      calories_per_serving: 350 + (i % 150),
      protein_g: 25 + (i % 20),
      carbs_g: 25 + (i % 25),
      fat_g: 12 + (i % 15),
      fiber_g: 5 + (i % 8),
      sugar_g: 6 + (i % 10),
      sodium_mg: 400 + (i % 300),
      cholesterol_mg: 60 + (i % 80),
      image_url: `https://images.unsplash.com/photo-${1569718212165 + i}?w=400`
    };
  });
};

const generateDinnerRecipes = (): Recipe[] => {
  const dinnerBases = [
    "Grilled Chicken", "Roasted Salmon", "Beef Stir Fry", "Pork Tenderloin", "Lamb Chops",
    "Fish Tacos", "Stuffed Peppers", "Meatballs", "Roast Beef", "Turkey Breast", "Shrimp Scampi",
    "Cod Fillet", "Duck Breast", "Venison Steak", "Rabbit Stew", "Bison Burger", "Elk Roast",
    "Chicken Thighs", "Pork Chops", "Beef Stroganoff", "Chicken Curry", "Fish Curry", "Meat Pie",
    "Braised Short Ribs", "BBQ Ribs"
  ];
  
  const preparations = ["Herb-Crusted", "Honey Glazed", "Spicy", "Garlic", "Lemon"];
  const sides = ["with Vegetables", "with Rice", "with Quinoa", "with Salad"];
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = dinnerBases[i % dinnerBases.length];
    const prep = preparations[Math.floor(i / dinnerBases.length) % preparations.length];
    const side = sides[Math.floor(i / (dinnerBases.length * preparations.length)) % sides.length];
    
    return {
      title: `${prep} ${base} ${side}`,
      original_recipe: `Traditional ${base.toLowerCase()}`,
      converted_recipe: `Gluten-free dinner with premium ingredients`,
      ingredients: [
        { name: "Main protein", amount: "8", unit: "oz" },
        { name: "Herbs and spices", amount: "2", unit: "tbsp" },
        { name: "Vegetables", amount: "3", unit: "cups" },
        { name: "Olive oil", amount: "2", unit: "tbsp" }
      ],
      instructions: ["Season protein", "Prepare vegetables", "Cook protein to temperature", "Plate and serve"],
      prep_time: 20 + (i % 15),
      cook_time: 30 + (i % 20),
      servings: 3 + (i % 3),
      difficulty_level: ["Easy", "Medium", "Hard"][i % 3],
      cuisine_type: "Dinner",
      is_public: true,
      calories_per_serving: 400 + (i % 200),
      protein_g: 30 + (i % 25),
      carbs_g: 20 + (i % 20),
      fat_g: 15 + (i % 18),
      fiber_g: 4 + (i % 8),
      sugar_g: 5 + (i % 10),
      sodium_mg: 500 + (i % 400),
      cholesterol_mg: 80 + (i % 100),
      image_url: `https://images.unsplash.com/photo-${1529042410759 + i}?w=400`
    };
  });
};

const sampleRecipes: Recipe[] = [
  ...generateBreakfastRecipes(),
  ...generateSnackRecipes(), 
  ...generateLunchRecipes(),
  ...generateDinnerRecipes()
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