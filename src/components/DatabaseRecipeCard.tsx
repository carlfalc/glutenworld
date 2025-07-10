import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Heart, ImageOff } from 'lucide-react';
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { DatabaseRecipe } from '@/hooks/useRecipeSearch';

interface DatabaseRecipeCardProps {
  recipe: DatabaseRecipe;
}

const DatabaseRecipeCard = ({ recipe }: DatabaseRecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const { data: isFav } = useIsFavorite('recipe', { itemId: recipe.id });
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

  const totalTime = recipe.cook_time ? (recipe.prep_time || 0) + recipe.cook_time : (recipe.prep_time || 0);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border">
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {!imageLoaded && !imageError && (
            <div className="animate-pulse bg-muted w-full h-full flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img
              src={recipe.image_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400'}
              alt={recipe.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${
            isFav ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          }`}
          onClick={handleFavoriteToggle}
        >
          <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
        </Button>
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

        {/* Nutritional Information */}
        {recipe.calories_per_serving && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Nutrition per serving
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Calories:</span>
                <span className="font-medium">{recipe.calories_per_serving}</span>
              </div>
              {recipe.protein_g && (
                <div className="flex justify-between">
                  <span>Protein:</span>
                  <span className="font-medium">{recipe.protein_g}g</span>
                </div>
              )}
              {recipe.carbs_g && (
                <div className="flex justify-between">
                  <span>Carbs:</span>
                  <span className="font-medium">{recipe.carbs_g}g</span>
                </div>
              )}
              {recipe.fat_g && (
                <div className="flex justify-between">
                  <span>Fat:</span>
                  <span className="font-medium">{recipe.fat_g}g</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cuisine and dietary info */}
        <div className="flex flex-wrap gap-1">
          {recipe.cuisine_type && (
            <Badge variant="secondary" className="text-xs">
              {recipe.cuisine_type}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">no gluten</Badge>
          <Badge variant="secondary" className="text-xs">healthy</Badge>
        </div>

        <Button className="w-full group-hover:bg-primary/90 transition-colors">
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default DatabaseRecipeCard;