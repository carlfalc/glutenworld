import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat } from 'lucide-react';
import { DatabaseRecipe } from '@/hooks/useRecipeSearch';

interface SimpleRecipeModalProps {
  recipe: DatabaseRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const SimpleRecipeModal = ({ recipe, isOpen, onClose }: SimpleRecipeModalProps) => {
  if (!recipe) return null;

  const totalTime = recipe.cook_time ? (recipe.prep_time || 0) + recipe.cook_time : (recipe.prep_time || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{totalTime} min</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{recipe.servings || 1}</div>
                <div className="text-sm text-muted-foreground">Servings</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{recipe.difficulty_level || 'Medium'}</div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {recipe.converted_recipe || recipe.original_recipe || "A delicious gluten-free recipe."}
            </p>
          </div>

          {/* Ingredients */}
          {recipe.ingredients && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="space-y-2">
                {Array.isArray(recipe.ingredients) ? (
                  recipe.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                      <span>{ingredient.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 bg-muted/20 rounded">
                    {JSON.stringify(recipe.ingredients)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction: string, index: number) => (
                  <div key={index} className="flex gap-3 p-3 bg-muted/20 rounded">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="flex-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition */}
          {recipe.calories_per_serving && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Nutrition (per serving)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/20 rounded text-center">
                  <div className="font-bold text-lg">{recipe.calories_per_serving}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                {recipe.protein_g && (
                  <div className="p-3 bg-muted/20 rounded text-center">
                    <div className="font-bold text-lg">{recipe.protein_g}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                )}
                {recipe.carbs_g && (
                  <div className="p-3 bg-muted/20 rounded text-center">
                    <div className="font-bold text-lg">{recipe.carbs_g}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                )}
                {recipe.fat_g && (
                  <div className="p-3 bg-muted/20 rounded text-center">
                    <div className="font-bold text-lg">{recipe.fat_g}g</div>
                    <div className="text-sm text-muted-foreground">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleRecipeModal;