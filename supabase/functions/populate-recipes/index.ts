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
  
  // Specific image mappings for recipe titles
  const getBreakfastImage = (title: string): string => {
    if (title.includes("Pancakes")) return "photo-1558618666-fcd25c85cd64"; // pancakes
    if (title.includes("Muffins")) return "photo-1517433456452-f9633a875f6f"; // muffins
    if (title.includes("Waffles")) return "photo-1565299624946-b28f40a0ca4b"; // waffles
    if (title.includes("Burrito")) return "photo-1556909114-f6e7ad7d3136"; // breakfast bowl/burrito
    if (title.includes("Smoothie Bowl")) return "photo-1571997478779-2adcbbe9ab2f"; // smoothie bowl
    if (title.includes("Parfait") || title.includes("Yogurt")) return "photo-1551782450-a2132b4ba21d"; // yogurt
    if (title.includes("Oats") || title.includes("Overnight")) return "photo-1551782450-a2132b4ba21d"; // oatmeal
    if (title.includes("Granola")) return "photo-1533089860892-a7c6f0a88666"; // granola
    if (title.includes("Omelette") || title.includes("Eggs")) return "photo-1484723091739-30a097e8f929"; // eggs
    if (title.includes("Toast") || title.includes("French")) return "photo-1547573854-74d2a71d0826"; // toast
    if (title.includes("Sandwich")) return "photo-1497888329096-51c27beff665"; // breakfast sandwich
    if (title.includes("Bowl")) return "photo-1556909114-f6e7ad7d3136"; // breakfast bowl
    return "photo-1558618666-fcd25c85cd64"; // default pancakes
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = breakfastBases[i % breakfastBases.length];
    const variation = variations[Math.floor(i / breakfastBases.length) % variations.length];
    const modifier = modifiers[Math.floor(i / (breakfastBases.length * variations.length)) % modifiers.length];
    const title = `${variation} ${modifier} ${base}`;
    const imageId = getBreakfastImage(title);
    
    return {
      title,
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
      image_url: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop`
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
  
  // Specific image mappings for snack titles
  const getSnackImage = (title: string): string => {
    if (title.includes("Energy Balls") || title.includes("Protein Balls")) return "photo-1579113800032-c38bd7635818"; // energy balls
    if (title.includes("Trail Mix")) return "photo-1559181567-c3190ca9959b"; // trail mix
    if (title.includes("Bars") || title.includes("Granola")) return "photo-1571115764595-644a1f56a55c"; // granola bars
    if (title.includes("Nuts")) return "photo-1567620905732-2d1ec7ab7445"; // nuts
    if (title.includes("Chips")) return "photo-1602248147666-d0ff619e2eae"; // chips
    if (title.includes("Cookies")) return "photo-1587132137056-bfbf0166836e"; // cookies
    if (title.includes("Hummus") || title.includes("Dip")) return "photo-1568830743174-7a82f0866e8b"; // hummus
    if (title.includes("Smoothie")) return "photo-1515543904379-3d47628d9d55"; // smoothie
    if (title.includes("Dried Fruit") || title.includes("Dates")) return "photo-1571064492674-69c9e4bb4b62"; // dried fruit
    if (title.includes("Bites")) return "photo-1612198188060-c7c2a3b66eae"; // protein bites
    return "photo-1579113800032-c38bd7635818"; // default energy balls
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = snackBases[i % snackBases.length];
    const flavor = flavors[Math.floor(i / snackBases.length) % flavors.length];
    const title = `${flavor} ${base}`;
    const imageId = getSnackImage(title);
    
    return {
      title,
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
      image_url: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop`
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
  
  // Specific image mappings for lunch titles
  const getLunchImage = (title: string): string => {
    if (title.includes("Salad")) return "photo-1567620905732-2d1ec7ab7445"; // salad
    if (title.includes("Soup")) return "photo-1547573854-74d2a71d0826"; // soup
    if (title.includes("Sandwich")) return "photo-1571091718767-18b5b1457add"; // sandwich
    if (title.includes("Wrap")) return "photo-1511690743698-d9d85f2fbf38"; // wrap
    if (title.includes("Pasta") || title.includes("Noodles")) return "photo-1512621776951-a57141f2eefd"; // pasta
    if (title.includes("Rice") || title.includes("Risotto")) return "photo-1565299624946-b28f40a0ca4b"; // rice dish
    if (title.includes("Stir Fry")) return "photo-1604909052743-94e838986d24"; // stir fry
    if (title.includes("Curry")) return "photo-1585937421612-70a008356fbe"; // curry
    if (title.includes("Tacos")) return "photo-1551024506-0bccd828d307"; // tacos
    if (title.includes("Burrito") || title.includes("Bowl")) return "photo-1626700051175-6818013e1d4f"; // burrito bowl
    if (title.includes("Pizza") || title.includes("Flatbread")) return "photo-1512621776951-a57141f2eefd"; // pizza/flatbread
    if (title.includes("Burger")) return "photo-1571091718767-18b5b1457add"; // burger
    if (title.includes("Stuffed")) return "photo-1626700051175-6818013e1d4f"; // stuffed items
    return "photo-1567620905732-2d1ec7ab7445"; // default salad
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = lunchBases[i % lunchBases.length];
    const protein = proteins[Math.floor(i / lunchBases.length) % proteins.length];
    const style = styles[Math.floor(i / (lunchBases.length * proteins.length)) % styles.length];
    const title = `${style} ${protein} ${base}`;
    const imageId = getLunchImage(title);
    
    return {
      title,
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
      image_url: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop`
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
  
  // Specific image mappings for dinner titles
  const getDinnerImage = (title: string): string => {
    if (title.includes("Chicken") && !title.includes("Curry")) return "photo-1504674900247-0877df9cc836"; // grilled chicken
    if (title.includes("Salmon") || title.includes("Fish")) return "photo-1467003909585-2f8a72700288"; // salmon
    if (title.includes("Beef") || title.includes("Stir Fry")) return "photo-1529042410759-befb1204b468"; // beef stir fry
    if (title.includes("Pork") || title.includes("Lamb")) return "photo-1544025162-d76694265947"; // meat dish
    if (title.includes("Stuffed Peppers")) return "photo-1606923842584-7f5ff0b7de9d"; // stuffed peppers
    if (title.includes("Meatballs")) return "photo-1551782450-17144efb9c50"; // meatballs
    if (title.includes("Roast") || title.includes("Turkey")) return "photo-1529042387047-c19bea7e6ad0"; // roast meat
    if (title.includes("Curry")) return "photo-1585937421612-70a008356fbe"; // curry
    if (title.includes("Ribs") || title.includes("BBQ")) return "photo-1544025162-d76694265947"; // ribs
    if (title.includes("Shrimp") || title.includes("Scampi")) return "photo-1467003909585-2f8a72700288"; // seafood
    return "photo-1603894584373-5ac82b2ae398"; // default main course
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const base = dinnerBases[i % dinnerBases.length];
    const prep = preparations[Math.floor(i / dinnerBases.length) % preparations.length];
    const side = sides[Math.floor(i / (dinnerBases.length * preparations.length)) % sides.length];
    const title = `${prep} ${base} ${side}`;
    const imageId = getDinnerImage(title);
    
    return {
      title,
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
      image_url: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop`
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