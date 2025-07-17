import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { AIRecipeGenerator } from '@/components/AIRecipeGenerator';
import DatabaseRecipeCard from '@/components/DatabaseRecipeCard';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';
import { useAIGeneratorAccess } from '@/hooks/useAIGeneratorAccess';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coffee, Apple, Utensils, Moon, Search, X, ChefHat, Loader, BookOpen, Menu, Heart } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const categories = [
  { id: 'all', label: 'All Recipes', icon: ChefHat, color: 'text-primary' },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-orange-500' },
  { id: 'snacks', label: 'Snacks', icon: Apple, color: 'text-green-500' },
  { id: 'lunch', label: 'Lunch', icon: Utensils, color: 'text-blue-500' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-purple-500' }
];

const RecipeMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPopulated, setHasPopulated] = useState(false);
  const navigate = useNavigate();
  
  const { searchRecipes, populateDatabase, searchResult, loading } = useRecipeSearch();
  const { checkAccess } = useAIGeneratorAccess();
  const { toast } = useToast();

  // Handle upgrade success/cancel from URL params
  useEffect(() => {
    const handleUpgradeResult = async () => {
      const upgrade = searchParams.get('upgrade');
      if (upgrade === 'success') {
        try {
          // Confirm the payment on our backend
          await supabase.functions.invoke('confirm-payment');
          toast({
            title: "Payment Successful! 🎉",
            description: "You now have access to the AI Recipe Generator!",
          });
          checkAccess(); // Refresh access status
        } catch (error) {
          console.error('Error confirming payment:', error);
          toast({
            title: "Payment Processing",
            description: "Your payment was successful. Access will be available shortly.",
          });
        }
        // Clean up URL params
        setSearchParams({});
      } else if (upgrade === 'cancelled') {
        toast({
          title: "Payment Cancelled",
          description: "Your purchase was cancelled. You can try again anytime.",
          variant: "destructive",
        });
        // Clean up URL params
        setSearchParams({});
      }
    };

    handleUpgradeResult();
  }, [searchParams, setSearchParams, toast, checkAccess]);

  // Populate database on first load
  useEffect(() => {
    const initializeData = async () => {
      if (!hasPopulated) {
        console.log('🔄 Populating database with recipes...');
        try {
          await populateDatabase();
          console.log('✅ Database population completed');
          setHasPopulated(true);
        } catch (error) {
          console.error('❌ Database population failed:', error);
        }
      } else {
        console.log('⚡ Database already populated, skipping...');
      }
    };
    
    initializeData();
  }, []); // Remove populateDatabase dependency to prevent re-calls

  // Load recipes when component mounts or filters change
  useEffect(() => {
    console.log('Loading recipes with filters:', { searchQuery, activeCategory });
    const filters = activeCategory !== 'all' ? { category: activeCategory } : {};
    searchRecipes(searchQuery, filters, 1, 12);
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (page: number) => {
    const filters = activeCategory !== 'all' ? { category: activeCategory } : {};
    searchRecipes(searchQuery, filters, page, 12);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Menu Button - Fixed Position */}
      <div className="fixed top-24 right-4 z-50 md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="bg-gluten-primary/90 hover:bg-gluten-primary text-white p-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              <Menu className="w-5 h-5" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh]">
            <div className="p-4 space-y-6">
              {/* My Recipes link at the top */}
              <div className="border-b border-border/50 pb-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                  onClick={() => navigate('/my-recipes')}
                >
                  <BookOpen className="w-5 h-5 mr-2 text-gluten-primary" />
                  My Recipes
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                  onClick={() => navigate('/dashboard')}
                >
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  My Favorites
                </Button>
              </div>
              
              {/* Subscription Status */}
              <div className="border-b border-border/50 pb-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">free</span>
                  <span>Subscription Status</span>
                </h3>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Premium Features
                </Button>
                <Button variant="default" size="sm" className="w-full mt-2 bg-gluten-primary hover:bg-gluten-primary/90">
                  Manage Subscription
                </Button>
              </div>
              
              {/* AI Generated Recipes */}
              <div>
                <h3 className="font-medium mb-2">AI Generated Recipes</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Browse unique, detailed gluten-free recipes powered by AI
                </p>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveCategory(category.id);
                        const drawerClose = document.querySelector('[data-vaul-drawer-close]');
                        if (drawerClose) {
                          (drawerClose as HTMLElement).click();
                        }
                      }}
                    >
                      <category.icon className={`w-4 h-4 mr-2 ${category.color}`} />
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            AI Recipe Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover delicious gluten-free recipes for every meal of the day. 
            All recipes are carefully curated to be safe, nutritious, and absolutely delicious.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-16">
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
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={`Search ${category.id === 'all' ? 'all' : category.label.toLowerCase()} recipes...`}
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
                {searchQuery && searchResult && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      {searchResult.totalCount} result{searchResult.totalCount !== 1 ? 's' : ''} found for "{searchQuery}"
                    </p>
                  </div>
                )}
                
                {/* AI Recipe Generator */}
                <div className="mb-8 max-w-md mx-auto">
                  <AIRecipeGenerator />
                </div>
              </div>


              {/* Recipe Grid */}
              {!loading && searchResult && searchResult.recipes.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResult.recipes.map((recipe) => (
                      <DatabaseRecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {searchResult.totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                      {Array.from({ length: searchResult.totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* No Results Message */}
              {!loading && searchResult && searchResult.recipes.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    No recipes found for "{searchQuery}" in {category.id === 'all' ? 'any category' : category.label.toLowerCase()}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try searching for different keywords or browse all recipes.
                  </p>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && searchResult && searchResult.recipes.length === 0 && !searchQuery && (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No recipes available yet.
                  </p>
                  <Button onClick={populateDatabase} variant="outline">
                    Load Sample Recipes
                  </Button>
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