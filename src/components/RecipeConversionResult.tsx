
import { useState } from 'react';
import { Save, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { toast } from '@/hooks/use-toast';

interface RecipeConversionResultProps {
  convertedRecipe: string;
  onBack: () => void;
  onSave: () => void;
}

const RecipeConversionResult = ({ convertedRecipe, onBack, onSave }: RecipeConversionResultProps) => {
  const [saved, setSaved] = useState(false);
  const createRecipeMutation = useCreateRecipe();

  const handleSave = async () => {
    try {
      // Extract title from the converted recipe (first line or first sentence)
      const lines = convertedRecipe.split('\n').filter(line => line.trim());
      const title = lines[0]?.replace(/^\d+\.\s*/, '').replace(/^#*\s*/, '') || 'Converted Gluten-Free Recipe';

      await createRecipeMutation.mutateAsync({
        title,
        original_recipe: '',
        converted_recipe: convertedRecipe,
        difficulty_level: 'Medium',
        is_public: false
      });

      setSaved(true);
      toast({
        title: "Recipe Saved!",
        description: "Your gluten-free recipe has been saved to your collection.",
      });
      
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h3 className="font-semibold">Gluten-Free Recipe Conversion</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gluten-primary">Your Converted Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {convertedRecipe}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={createRecipeMutation.isPending || saved}
          className="flex-1 bg-gluten-primary"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : createRecipeMutation.isPending ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Recipe
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecipeConversionResult;
