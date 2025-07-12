import { useState } from 'react';
import { Brain, Sparkles, Lock, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAIRecipePopulation } from '@/hooks/useAIRecipePopulation';
import { useAIGeneratorAccess } from '@/hooks/useAIGeneratorAccess';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const AIRecipeGenerator = () => {
  const { generateAIRecipes, isGenerating, progress, generatedRecipeCount } = useAIRecipePopulation();
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

  const handleGrantAccess = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('grant-access');
      if (error) throw error;
      console.log('Access granted:', data);
      // Refresh access status
      location.reload();
    } catch (error) {
      console.error('Error granting access:', error);
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

        {/* Progress Display */}
        {hasAccess && (progress || generatedRecipeCount > 0) && (
          <div className="space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
            {progress?.status === 'completed' || generatedRecipeCount >= 400 ? (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Generation Complete!</span>
              </div>
            ) : isGenerating ? (
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Generating in Background...</span>
              </div>
            ) : null}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {progress?.generated_recipes || generatedRecipeCount}/400 recipes</span>
                <span>{Math.round(((progress?.generated_recipes || generatedRecipeCount) / 400) * 100)}%</span>
              </div>
              <Progress 
                value={((progress?.generated_recipes || generatedRecipeCount) / 400) * 100} 
                className="h-2"
              />
              {progress?.current_category && (
                <p className="text-xs text-muted-foreground">
                  Currently generating: {progress.current_category} recipes
                </p>
              )}
            </div>
            
            {progress?.status === 'completed' || generatedRecipeCount >= 400 ? (
              <p className="text-sm text-green-700 dark:text-green-300">
                ✨ {generatedRecipeCount || progress?.generated_recipes} AI-generated recipes are now available! Browse them using the category tabs above.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                💡 You can navigate away and come back - generation continues in the background!
              </p>
            )}
          </div>
        )}

        <Button 
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium"
          disabled={isGenerating || loading}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating... ({progress?.generated_recipes || 0}/400)
            </>
          ) : progress?.status === 'completed' || generatedRecipeCount >= 400 ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Recipes Ready! ({generatedRecipeCount} Generated)
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

        {/* Temporary fix button - remove this after testing */}
        {!hasAccess && (
          <Button 
            onClick={handleGrantAccess}
            variant="outline"
            className="w-full mt-2"
          >
            🔧 Fix Access (Temporary)
          </Button>
        )}

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
                <p className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 p-2 rounded">
                  <strong>Background Generation:</strong> Recipes will be generated in the background - you can navigate away and come back to check progress! Generation continues even if you leave this page.
                </p>
                <p className="text-sm">Each recipe will include detailed ingredients, instructions, nutritional information, and cooking times.</p>
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