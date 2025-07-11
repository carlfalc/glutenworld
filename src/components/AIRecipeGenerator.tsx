import { useState } from 'react';
import { Brain, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIRecipePopulation } from '@/hooks/useAIRecipePopulation';
import { useAIGeneratorAccess } from '@/hooks/useAIGeneratorAccess';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const AIRecipeGenerator = () => {
  const { generateAIRecipes, isGenerating } = useAIRecipePopulation();
  const { hasAccess, hasPaidUpgrade, loading, purchaseUpgrade } = useAIGeneratorAccess();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleGenerate = async () => {
    setShowConfirmDialog(false);
    await generateAIRecipes();
  };

  const handleUpgrade = async () => {
    try {
      setShowUpgradeDialog(false);
      await purchaseUpgrade();
    } catch (error) {
      console.error('Error upgrading:', error);
    }
  };

  const handleClick = () => {
    if (hasAccess) {
      setShowConfirmDialog(true);
    } else {
      setShowUpgradeDialog(true);
    }
  };

  return (
    <Card className="border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10 relative">
      {!hasAccess && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-6">
            <Lock className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Unlock AI Recipe Generator</h3>
            <p className="text-white/80 text-sm mb-4">Get yearly access for just $4.99</p>
            <Button 
              onClick={handleClick}
              className="bg-gluten-primary hover:bg-gluten-primary/90 text-white"
            >
              Unlock for $4.99/year
            </Button>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="w-5 h-5" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription className="text-sm">
          Generate 400 unique, detailed gluten-free recipes using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>100 Breakfast</strong> recipes
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>100 Snack</strong> recipes  
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>100 Lunch</strong> recipes
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>100 Dinner</strong> recipes
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground bg-accent/20 p-2 rounded">
          Each recipe includes: detailed ingredients, step-by-step instructions, nutritional info, cooking times, and beautiful images.
        </div>

        <Button 
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium"
          disabled={isGenerating || loading}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Recipes...
            </>
          ) : hasAccess ? (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate 400 AI Recipes
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Unlock for $4.99/year
            </>
          )}
        </Button>

        {/* Upgrade Dialog */}
        <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock AI Recipe Generator</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Get yearly access to generate 400 unique AI-powered gluten-free recipes for just <strong>$4.99</strong>!</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>100 Breakfast recipes</li>
                  <li>100 Snack recipes</li>
                  <li>100 Lunch recipes</li>
                  <li>100 Dinner recipes</li>
                </ul>
                <p className="text-sm">Each recipe includes detailed ingredients, instructions, nutritional information, and cooking times.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpgrade} className="bg-gluten-primary hover:bg-gluten-primary/90">
                Purchase for $4.99
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Generate Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Generate 400 AI-Powered Recipes?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This will generate 400 unique, detailed gluten-free recipes using AI:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>100 Breakfast recipes</li>
                  <li>100 Snack recipes</li>
                  <li>100 Lunch recipes</li>
                  <li>100 Dinner recipes</li>
                </ul>
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  <strong>Warning:</strong> This will replace any existing recipes in your database.
                </p>
                <p className="text-sm">Each recipe will include detailed ingredients, instructions, nutritional information, and cooking times. This process may take a few minutes.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerate}>
                Generate Recipes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};