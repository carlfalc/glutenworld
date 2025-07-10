import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Heart, Plus, X } from 'lucide-react';
import { DatabaseRecipe } from '@/hooks/useRecipeSearch';
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite } from '@/hooks/useFavorites';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { useUserRecipeRating, useRateRecipe } from '@/hooks/useRecipeRatings';
import { useToast } from '@/hooks/use-toast';
import StarRating from './StarRating';

interface RecipeDetailsModalProps {
  recipe: DatabaseRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailsModal = ({ recipe, isOpen, onClose }: RecipeDetailsModalProps) => {
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const createRecipeMutation = useCreateRecipe();
  const { data: isFav } = useIsFavorite('recipe', { itemId: recipe?.id });
  const { data: userRating } = useUserRecipeRating(recipe?.id || '');
  const rateRecipeMutation = useRateRecipe();
  const { toast } = useToast();

  if (!recipe || !isOpen) return null;

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
    try {
      if (isFav) {
        removeFromFavoritesMutation.mutate(recipe.id);
      } else {
        addToFavoritesMutation.mutate({
          type: 'recipe',
          recipe_id: recipe.id,
        });
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
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
      console.error('Add to recipes error:', error);
      toast({
        title: "Error",
        description: "Failed to add recipe to your collection.",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    try {
      rateRecipeMutation.mutate({ recipeId: recipe.id, rating });
    } catch (error) {
      console.error('Rating change error:', error);
    }
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
    <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold leading-none tracking-tight mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              {recipe.difficulty_level && (
                <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                  {recipe.difficulty_level}
                </Badge>
              )}
              {recipe.cuisine_type && (
                <Badge variant="secondary">
                  {recipe.cuisine_type}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${
                isFav ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
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

          {/* Recipe Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{recipe.servings || 1} servings</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ChefHat className="h-4 w-4 text-primary" />
              <span>{recipe.difficulty_level || 'Medium'}</span>
            </div>
          </div>

          {/* Dietary Labels */}
          <div className="flex flex-wrap gap-2">
            {getDietaryLabels().map((label, index) => (
              <Badge key={index} className={`${label.color} border-0`}>
                {label.text}
              </Badge>
            ))}
          </div>

          {/* Recipe Description */}
          {(recipe.converted_recipe || recipe.original_recipe) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {recipe.converted_recipe || recipe.original_recipe}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleAddToMyRecipes}
              disabled={createRecipeMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to My Recipes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;