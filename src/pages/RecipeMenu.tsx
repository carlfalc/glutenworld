import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { Coffee, Apple, Utensils, Moon, Search, X } from 'lucide-react';

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
      tags: ['no gluten', 'dairy-free', 'vegetarian']
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
      tags: ['no gluten', 'vegan', 'protein-rich']
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
      tags: ['no gluten', 'vegan', 'no-cook']
    },
    {
      id: '10',
      title: 'Scrambled Eggs',
      image: 'https://images.unsplash.com/photo-1582169296194-9bdeb1a11cea?w=400',
      difficulty: 'Easy' as const,
      prepTime: 2,
      cookTime: 5,
      servings: 2,
      description: 'Creamy scrambled eggs with herbs, naturally gluten-free.',
      tags: ['no gluten', 'protein-rich', 'vegetarian']
    },
    {
      id: '11',
      title: 'Avocado Toast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
      difficulty: 'Easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      description: 'Fresh avocado on gluten-free bread with lime and seasoning.',
      tags: ['no gluten', 'vegan', 'healthy-fats']
    },
    {
      id: '12',
      title: 'Greek Yogurt Parfait',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      difficulty: 'Easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      description: 'Layered Greek yogurt with berries and gluten-free granola.',
      tags: ['no gluten', 'vegetarian', 'protein-rich']
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
      tags: ['no gluten', 'vegan', 'no-cook']
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
      tags: ['no gluten', 'vegan', 'protein-rich']
    },
    {
      id: '13',
      title: 'Apple Slices with Almond Butter',
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400',
      difficulty: 'Easy' as const,
      prepTime: 2,
      cookTime: 0,
      servings: 1,
      description: 'Fresh apple slices with natural almond butter.',
      tags: ['no gluten', 'vegan', 'healthy-fats']
    },
    {
      id: '14',
      title: 'Trail Mix',
      image: 'https://images.unsplash.com/photo-1599909275296-9b97b9ed4d26?w=400',
      difficulty: 'Easy' as const,
      prepTime: 5,
      cookTime: 0,
      servings: 8,
      description: 'Mixed nuts, seeds, and dried fruit blend.',
      tags: ['no gluten', 'vegan', 'protein-rich']
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
      tags: ['no gluten', 'vegan', 'nutritious']
    },
    {
      id: '7',
      title: 'Zucchini Noodles',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      difficulty: 'Easy' as const,
      prepTime: 15,
      cookTime: 5,
      servings: 3,
      description: 'Fresh zucchini noodles with tomato basil sauce.',
      tags: ['no gluten', 'low-carb', 'vegetarian']
    },
    {
      id: '15',
      title: 'Quinoa Salad',
      image: 'https://images.unsplash.com/photo-1505253213348-cd54c92b37eb?w=400',
      difficulty: 'Easy' as const,
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      description: 'Mediterranean quinoa salad with vegetables and herbs.',
      tags: ['no gluten', 'vegan', 'fiber-rich']
    },
    {
      id: '16',
      title: 'Chicken Caesar Salad',
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400',
      difficulty: 'Medium' as const,
      prepTime: 20,
      cookTime: 15,
      servings: 2,
      description: 'Classic Caesar salad with grilled chicken and gluten-free croutons.',
      tags: ['no gluten', 'protein-rich', 'dairy-free']
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
      tags: ['no gluten', 'protein-rich', 'omega-3']
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
      tags: ['no gluten', 'vegetarian', 'fiber-rich']
    },
    {
      id: '17',
      title: 'Herb-Crusted Chicken',
      image: 'https://images.unsplash.com/photo-1550750165-3b829b8f0c31?w=400',
      difficulty: 'Medium' as const,
      prepTime: 10,
      cookTime: 25,
      servings: 4,
      description: 'Juicy chicken breast with herb crust and roasted potatoes.',
      tags: ['no gluten', 'protein-rich', 'dairy-free']
    },
    {
      id: '18',
      title: 'Vegetable Stir Fry',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      difficulty: 'Easy' as const,
      prepTime: 15,
      cookTime: 10,
      servings: 3,
      description: 'Fresh vegetables stir-fried with gluten-free tamari sauce.',
      tags: ['no gluten', 'vegan', 'quick-cook']
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
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    const currentRecipes = recipeData[activeCategory as keyof typeof recipeData] || [];
    
    if (!searchQuery.trim()) {
      return currentRecipes;
    }

    return currentRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

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
              {/* Search Bar for each category */}
              <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={`Search ${category.label.toLowerCase()} recipes...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {/* Search Results Info */}
                {searchQuery && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      {filteredRecipes.length} result{filteredRecipes.length !== 1 ? 's' : ''} found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* No Results Message */}
              {filteredRecipes.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    No recipes found for "{searchQuery}" in {category.label.toLowerCase()}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try searching for different keywords or browse all {category.label.toLowerCase()} recipes.
                  </p>
                </div>
              )}
              
              {/* Empty Category Message */}
              {filteredRecipes.length === 0 && !searchQuery && (
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