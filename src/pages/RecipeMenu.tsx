import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { Coffee, Apple, Utensils, Moon } from 'lucide-react';

// Sample recipe data - this would eventually come from Supabase
const recipeData = {
  breakfast: [
    {
      id: '1',
      title: 'Gluten-Free Pancakes',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      difficulty: 'Easy' as const,
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      description: 'Fluffy and delicious gluten-free pancakes made with almond flour.',
      tags: ['dairy-free', 'vegetarian']
    },
    {
      id: '2', 
      title: 'Quinoa Breakfast Bowl',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400',
      difficulty: 'Medium' as const,
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      description: 'Nutritious quinoa bowl with fresh fruits and nuts.',
      tags: ['vegan', 'protein-rich']
    },
    {
      id: '3',
      title: 'Coconut Chia Pudding',
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400',
      difficulty: 'Easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      description: 'Creamy overnight chia pudding with coconut milk.',
      tags: ['vegan', 'no-cook']
    }
  ],
  snacks: [
    {
      id: '4',
      title: 'Energy Balls',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      difficulty: 'Easy' as const,
      prepTime: 10,
      cookTime: 0,
      servings: 12,
      description: 'No-bake energy balls with dates and nuts.',
      tags: ['vegan', 'no-cook']
    },
    {
      id: '5',
      title: 'Rice Crackers with Hummus',
      image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400',
      difficulty: 'Easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 4,
      description: 'Crispy rice crackers paired with homemade hummus.',
      tags: ['vegan', 'protein-rich']
    }
  ],
  lunch: [
    {
      id: '6',
      title: 'Buddha Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      difficulty: 'Medium' as const,
      prepTime: 20,
      cookTime: 25,
      servings: 2,
      description: 'Colorful Buddha bowl with roasted vegetables and quinoa.',
      tags: ['vegan', 'nutritious']
    },
    {
      id: '7',
      title: 'Zucchini Noodles',
      image: 'https://images.unsplash.com/photo-1594756202469-9ff9799652b8?w=400',
      difficulty: 'Easy' as const,
      prepTime: 15,
      cookTime: 5,
      servings: 3,
      description: 'Fresh zucchini noodles with tomato basil sauce.',
      tags: ['low-carb', 'vegetarian']
    }
  ],
  dinner: [
    {
      id: '8',
      title: 'Grilled Salmon with Vegetables',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      difficulty: 'Medium' as const,
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      description: 'Perfectly grilled salmon with seasonal roasted vegetables.',
      tags: ['protein-rich', 'omega-3']
    },
    {
      id: '9',
      title: 'Stuffed Bell Peppers',
      image: 'https://images.unsplash.com/photo-1606905100777-a3c6e0c37bc9?w=400',
      difficulty: 'Hard' as const,
      prepTime: 30,
      cookTime: 45,
      servings: 4,
      description: 'Bell peppers stuffed with quinoa, vegetables, and herbs.',
      tags: ['vegetarian', 'fiber-rich']
    }
  ]
};

const categories = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-orange-500' },
  { id: 'snacks', label: 'Snacks', icon: Apple, color: 'text-green-500' },
  { id: 'lunch', label: 'Lunch', icon: Utensils, color: 'text-blue-500' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-purple-500' }
];

const RecipeMenu = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Gluten-Free Recipe Menu
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover delicious gluten-free recipes for every meal of the day. 
            All recipes are carefully curated to be safe, nutritious, and absolutely delicious.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-16">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <IconComponent className={`h-5 w-5 ${category.color}`} />
                  <span>{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipeData[category.id as keyof typeof recipeData]?.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {recipeData[category.id as keyof typeof recipeData]?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No recipes available in this category yet.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default RecipeMenu;