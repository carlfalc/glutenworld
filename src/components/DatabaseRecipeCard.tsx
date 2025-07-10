import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Heart, Plus } from 'lucide-react';
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite } from '@/hooks/useFavorites';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { useUserRecipeRating, useRateRecipe } from '@/hooks/useRecipeRatings';
import { useToast } from '@/hooks/use-toast';
import { DatabaseRecipe } from '@/hooks/useRecipeSearch';
import StarRating from './StarRating';
import RecipeDetailsModal from './RecipeDetailsModal';

interface DatabaseRecipeCardProps {
  recipe: DatabaseRecipe;
}

const DatabaseRecipeCard = ({ recipe }: DatabaseRecipeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const createRecipeMutation = useCreateRecipe();
  const { data: isFav } = useIsFavorite('recipe', { itemId: recipe.id });
  const { data: userRating } = useUserRecipeRating(recipe.id);
  const rateRecipeMutation = useRateRecipe();
  const { toast } = useToast();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleFavoriteToggle = async () => {
    if (isFav) {
      removeFromFavoritesMutation.mutate(recipe.id);
    } else {
      addToFavoritesMutation.mutate({
        type: 'recipe',
        recipe_id: recipe.id,
      });
    }
  };

  const handleAddToMyRecipes = async () => {
    try {
      await createRecipeMutation.mutateAsync({
        title: recipe.title,
        original_recipe: recipe.original_recipe,
        converted_recipe: recipe.converted_recipe,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        difficulty_level: recipe.difficulty_level as 'Easy' | 'Medium' | 'Hard' | undefined,
        cuisine_type: recipe.cuisine_type,
        calories_per_serving: recipe.calories_per_serving,
        protein_g: recipe.protein_g,
        carbs_g: recipe.carbs_g,
        fat_g: recipe.fat_g,
        fiber_g: recipe.fiber_g,
        sugar_g: recipe.sugar_g,
        sodium_mg: recipe.sodium_mg,
        cholesterol_mg: recipe.cholesterol_mg,
        is_public: false,
      });
      toast({
        title: "Recipe added",
        description: "Recipe has been added to your collection!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add recipe to your collection.",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    rateRecipeMutation.mutate({ recipeId: recipe.id, rating });
  };

  const getDietaryLabels = () => {
    const labels = [];
    
    // Always include no gluten since this is a gluten-free app
    labels.push({ text: 'no gluten', color: 'bg-green-500/20 text-green-600' });
    
    // Check for other dietary preferences based on recipe content
    const content = (recipe.title + ' ' + (recipe.converted_recipe || recipe.original_recipe || '')).toLowerCase();
    
    if (content.includes('dairy free') || content.includes('dairy-free') || content.includes('vegan')) {
      labels.push({ text: 'dairy free', color: 'bg-blue-500/20 text-blue-600' });
    }
    
    if (content.includes('vegan')) {
      labels.push({ text: 'vegan', color: 'bg-purple-500/20 text-purple-600' });
    }
    
    if (content.includes('vegetarian') && !content.includes('vegan')) {
      labels.push({ text: 'vegetarian', color: 'bg-orange-500/20 text-orange-600' });
    }
    
    if (content.includes('low carb') || content.includes('low-carb') || content.includes('keto')) {
      labels.push({ text: 'low carb', color: 'bg-red-500/20 text-red-600' });
    }
    
    if (content.includes('high protein')) {
      labels.push({ text: 'high protein', color: 'bg-emerald-500/20 text-emerald-600' });
    }
    
    return labels;
  };

  const totalTime = recipe.cook_time ? (recipe.prep_time || 0) + recipe.cook_time : (recipe.prep_time || 0);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border">
      <div className="relative p-4 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="flex items-start justify-between mb-2">
          <ChefHat className="h-8 w-8 text-primary/60" />
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full hover:bg-background/80 transition-colors ${
              isFav ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {/* Star Rating */}
        <div className="flex items-center justify-between">
          <StarRating
            rating={userRating?.rating || 0}
            onRatingChange={handleRatingChange}
            interactive={true}
            size="md"
          />
          <div className="text-sm text-muted-foreground">
            Rate this recipe
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          {recipe.difficulty_level && (
            <Badge className={`shrink-0 ${getDifficultyColor(recipe.difficulty_level)}`}>
              {recipe.difficulty_level}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {recipe.converted_recipe || recipe.original_recipe || "Delicious gluten-free recipe"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings || 1} servings</span>
          </div>
        </div>

        {/* Nutritional Information - Highlighted Macros */}
        {recipe.calories_per_serving && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 space-y-2 border border-primary/20">
            <div className="text-xs font-medium text-primary uppercase tracking-wide flex items-center gap-1">
              <ChefHat className="h-3 w-3" />
              Nutrition Highlights
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between bg-background/50 rounded p-2">
                <span className="text-muted-foreground">Calories:</span>
                <span className="font-bold text-primary">{recipe.calories_per_serving}</span>
              </div>
              {recipe.protein_g && (
                <div className="flex justify-between bg-background/50 rounded p-2">
                  <span className="text-muted-foreground">Protein:</span>
                  <span className="font-bold text-primary">{recipe.protein_g}g</span>
                </div>
              )}
              {recipe.carbs_g && (
                <div className="flex justify-between bg-background/50 rounded p-2">
                  <span className="text-muted-foreground">Carbs:</span>
                  <span className="font-bold text-primary">{recipe.carbs_g}g</span>
                </div>
              )}
              {recipe.fat_g && (
                <div className="flex justify-between bg-background/50 rounded p-2">
                  <span className="text-muted-foreground">Fat:</span>
                  <span className="font-bold text-primary">{recipe.fat_g}g</span>
                </div>
              )}
              {recipe.fiber_g && (
                <div className="flex justify-between bg-background/50 rounded p-2">
                  <span className="text-muted-foreground">Fiber:</span>
                  <span className="font-bold text-primary">{recipe.fiber_g}g</span>
                </div>
              )}
              {recipe.sodium_mg && (
                <div className="flex justify-between bg-background/50 rounded p-2">
                  <span className="text-muted-foreground">Sodium:</span>
                  <span className="font-bold text-primary">{recipe.sodium_mg}mg</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dietary Labels */}
        <div className="flex flex-wrap gap-1">
          {recipe.cuisine_type && (
            <Badge variant="secondary" className="text-xs">
              {recipe.cuisine_type}
            </Badge>
          )}
          {getDietaryLabels().map((label, index) => (
            <Badge key={index} className={`text-xs ${label.color} border-0`}>
              {label.text}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleAddToMyRecipes}
            disabled={createRecipeMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to My Recipes
          </Button>
          <Button 
            className="flex-1 group-hover:bg-primary/90 transition-colors"
            onClick={() => {
              console.log('View Recipe clicked for:', recipe.title);
              console.log('Full recipe data:', recipe);
              setIsModalOpen(true);
            }}
          >
            View Recipe
          </Button>
        </div>
      </CardContent>

      <RecipeDetailsModal
        recipe={recipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default DatabaseRecipeCard;