
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FavoriteButton from '@/components/FavoriteButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Search, Filter, Plus, Clock, Users, Star, BookOpen, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

const MyRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: favoritedRecipes = [] } = useFavorites('recipe');

  // Mock data for recipes - in a real app, this would come from your backend
  const myRecipes = [
    {
      id: 1,
      title: "Gluten-Free Chocolate Chip Cookies",
      description: "Converted from traditional recipe using almond flour",
      cookTime: "25 min",
      servings: 12,
      rating: 4.8,
      category: "Desserts",
      dateCreated: "2024-01-15",
      isGlutenFree: true
    },
    {
      id: 2,
      title: "GF Banana Bread",
      description: "Moist and delicious gluten-free banana bread",
      cookTime: "60 min",
      servings: 8,
      rating: 4.6,
      category: "Baking",
      dateCreated: "2024-01-10",
      isGlutenFree: true
    },
    {
      id: 3,
      title: "Quinoa Stuffed Bell Peppers",
      description: "Healthy and naturally gluten-free dinner option",
      cookTime: "45 min",
      servings: 4,
      rating: 4.7,
      category: "Main Dishes",
      dateCreated: "2024-01-08",
      isGlutenFree: true
    }
  ];

  const favoriteRecipes = [
    {
      id: 4,
      title: "GF Pizza Dough",
      description: "Perfect gluten-free pizza base",
      cookTime: "90 min",
      servings: 4,
      rating: 4.9,
      category: "Main Dishes",
      author: "Chef Maria"
    }
  ];

  const filteredRecipes = myRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/5 via-background to-gluten-secondary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-gluten-primary" />
            My Recipes
          </h1>
          <p className="text-muted-foreground">Manage your gluten-free recipe collection</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gluten-primary hover:bg-gluten-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="my-recipes">My Recipes ({myRecipes.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favoriteRecipes.length})</TabsTrigger>
            <TabsTrigger value="saved-favorites">
              <Heart className="w-4 h-4 mr-1" />
              Saved ({favoritedRecipes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-recipes" className="space-y-4">
            {filteredRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start creating your first gluten-free recipe!'}
                  </p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gluten-primary hover:bg-gluten-primary/90"
                  >
                    Create Your First Recipe
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <FavoriteButton 
                            type="recipe" 
                            itemId={recipe.id.toString()} 
                          />
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            {recipe.rating}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {recipe.cookTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {recipe.servings}
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Gluten-Free
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(recipe.dateCreated).toLocaleDateString()}
                          </span>
                          <Button size="sm" variant="outline">
                            View Recipe
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <FavoriteButton 
                          type="recipe" 
                          itemId={recipe.id.toString()} 
                        />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {recipe.rating}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.cookTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {recipe.servings}
                        </span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Gluten-Free
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          By {recipe.author}
                        </span>
                        <Button size="sm" variant="outline">
                          View Recipe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved-favorites" className="space-y-4">
            {favoritedRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding recipes to your favorites to see them here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedRecipes.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Saved Recipe</CardTitle>
                        <FavoriteButton 
                          type="recipe" 
                          itemId={favorite.recipe_id} 
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Saved {new Date(favorite.created_at).toLocaleDateString()}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Gluten-Free
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRecipes;
