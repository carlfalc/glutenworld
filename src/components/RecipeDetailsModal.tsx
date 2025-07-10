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
  console.log('🟡 Modal render called with:', { 
    recipe: !!recipe, 
    isOpen, 
    recipeTitle: recipe?.title,
    recipeData: recipe 
  });
  
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const createRecipeMutation = useCreateRecipe();
  const { data: isFav } = useIsFavorite('recipe', { itemId: recipe?.id });
  const { data: userRating } = useUserRecipeRating(recipe?.id || '');
  const rateRecipeMutation = useRateRecipe();
  const { toast } = useToast();

  if (!recipe) {
    console.log('🔴 No recipe provided to modal');
    return null;
  }
  
  if (!isOpen) {
    console.log('🔴 Modal not open');
    return null;
  }

  console.log('🟢 Modal will render with recipe:', recipe.title);

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

  const totalTime = recipe.cook_time ? (recipe.prep_time || 0) + recipe.cook_time : (recipe.prep_time || 0);

  console.log('🟢 About to render Dialog JSX');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-red-500 text-white p-4 rounded">
            <h2>DEBUG: Modal is rendering!</h2>
            <p>Recipe: {recipe.title}</p>
            <p>Ingredients type: {typeof recipe.ingredients}</p>
            <p>Instructions type: {typeof recipe.instructions}</p>
          </div>
          {/* Recipe Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{totalTime} min total</span>
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

          {/* Description */}
          {(recipe.converted_recipe || recipe.original_recipe) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {recipe.converted_recipe || recipe.original_recipe}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Ingredients</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                {Array.isArray(recipe.ingredients) ? (
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">{String(recipe.ingredients)}</p>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="flex-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Info */}
          {recipe.calories_per_serving && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20">
              <div className="text-sm font-medium text-primary uppercase tracking-wide flex items-center gap-2 mb-3">
                <ChefHat className="h-4 w-4" />
                Nutrition Highlights
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex justify-between bg-background/50 rounded p-3">
                  <span className="text-muted-foreground">Calories:</span>
                  <span className="font-bold text-primary">{recipe.calories_per_serving}</span>
                </div>
                {recipe.protein_g && (
                  <div className="flex justify-between bg-background/50 rounded p-3">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-bold text-primary">{recipe.protein_g}g</span>
                  </div>
                )}
                {recipe.carbs_g && (
                  <div className="flex justify-between bg-background/50 rounded p-3">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-bold text-primary">{recipe.carbs_g}g</span>
                  </div>
                )}
              </div>
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
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailsModal;