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
  console.log('Modal render called with:', { recipe: !!recipe, isOpen, recipeTitle: recipe?.title });
  
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const createRecipeMutation = useCreateRecipe();
  const { data: isFav } = useIsFavorite('recipe', { itemId: recipe?.id });
  const { data: userRating } = useUserRecipeRating(recipe?.id || '');
  const rateRecipeMutation = useRateRecipe();
  const { toast } = useToast();

  if (!recipe) {
    console.log('No recipe provided to modal');
    return null;
  }
  
  if (!isOpen) {
    console.log('Modal not open');
    return null;
  }

  // Debug log to see recipe data structure
  console.log('Recipe data in modal:', {
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    hasIngredients: !!recipe.ingredients,
    hasInstructions: !!recipe.instructions && recipe.instructions.length > 0,
    ingredientsType: typeof recipe.ingredients,
    instructionsType: typeof recipe.instructions
  });

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

  console.log('About to render Dialog with isOpen:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-lg">This is a test modal for: <strong>{recipe.title}</strong></p>
          <p>Recipe ID: {recipe.id}</p>
          <p>Prep time: {recipe.prep_time} minutes</p>
          <p>Cook time: {recipe.cook_time} minutes</p>
          
          <Button onClick={onClose} className="w-full">
            Close Modal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailsModal;