
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
import { useRecipes } from '@/hooks/useRecipes';
import { useFavoritedRecipes } from '@/hooks/useFavoritedRecipes';

const MyRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: favoriteEntries = [] } = useFavorites('recipe');
  const { data: myRecipes = [], isLoading } = useRecipes();
  const { data: favoritedRecipes = [] } = useFavoritedRecipes();

  // Use our actual recipe data instead of hardcoded samples
  const favoriteRecipes = myRecipes.filter(recipe => 
    favoriteEntries.some(fav => fav.recipe_id === recipe.id)
  );

  const filteredRecipes = myRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipe.converted_recipe && recipe.converted_recipe.toLowerCase().includes(searchTerm.toLowerCase()))
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
              Saved ({favoriteEntries.length})
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
                             {recipe.average_rating?.toFixed(1) || 'N/A'}
                           </div>
                         </div>
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2">
                         {recipe.converted_recipe || recipe.original_recipe || 'No description available'}
                       </p>
                     </CardHeader>
                     <CardContent>
                       <div className="flex items-center justify-between text-sm text-muted-foreground">
                         <div className="flex items-center gap-4">
                           <span className="flex items-center gap-1">
                             <Clock className="w-4 h-4" />
                             {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
                           </span>
                           <span className="flex items-center gap-1">
                             <Users className="w-4 h-4" />
                             {recipe.servings || 'N/A'}
                           </span>
                         </div>
                         <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                           Gluten-Free
                         </span>
                       </div>
                       <div className="mt-4 pt-4 border-t border-border/50">
                         <div className="flex justify-between items-center">
                           <span className="text-xs text-muted-foreground">
                             Created {new Date(recipe.created_at).toLocaleDateString()}
                          </span>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={(e) => {
                               e.stopPropagation();
                               // Navigate to recipe details or open modal
                               console.log('View recipe:', recipe);
                               // For now, show the recipe content in a toast/alert
                               alert(`Recipe: ${recipe.title}\n\n${recipe.converted_recipe || recipe.original_recipe || 'No recipe content available'}`);
                             }}
                           >
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
            {favoriteRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorite recipes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Click the heart icon on recipes to add them to your favorites
                  </p>
                </CardContent>
              </Card>
            ) : (
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
                            {recipe.average_rating?.toFixed(1) || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.converted_recipe || recipe.original_recipe || 'No description available'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {recipe.servings || 'N/A'}
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Gluten-Free
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Added {new Date(recipe.created_at).toLocaleDateString()}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('View favorite recipe:', recipe);
                              alert(`Recipe: ${recipe.title}\n\n${recipe.converted_recipe || recipe.original_recipe || 'No recipe content available'}`);
                            }}
                          >
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

          <TabsContent value="saved-favorites" className="space-y-4">
            {favoriteEntries.length === 0 ? (
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
                {favoritedRecipes.length > 0 ? (
                  favoritedRecipes.map((recipe) => (
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
                              {recipe.average_rating?.toFixed(1) || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.converted_recipe || recipe.original_recipe || 'No description available'}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {recipe.servings || 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Gluten-Free
                          </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Saved {new Date(recipe.created_at).toLocaleDateString()}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('View recipe:', recipe);
                                alert(`Recipe: ${recipe.title}\n\n${recipe.converted_recipe || recipe.original_recipe || 'No recipe content available'}`);
                              }}
                            >
                              View Recipe
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full text-center py-8">
                    <CardContent>
                      <p className="text-muted-foreground">Loading your favorite recipes...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRecipes;
