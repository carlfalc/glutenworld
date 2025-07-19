import { useState } from 'react';
import { Brain, Sparkles, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIGeneratorAccess } from '@/hooks/useAIGeneratorAccess';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const AIRecipeGenerator = () => {
  const { hasAccess, hasPaidUpgrade, loading, purchaseUpgrade } = useAIGeneratorAccess();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

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
    if (!hasAccess) {
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
          AI Generated Recipes
        </CardTitle>
        <CardDescription className="text-sm">
          Browse unique, detailed gluten-free recipes powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>Breakfast</strong> recipes
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>Snack</strong> recipes  
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>Lunch</strong> recipes
          </p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <strong>Dinner</strong> recipes
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground bg-accent/20 p-2 rounded">
          Each recipe includes: detailed ingredients, step-by-step instructions, nutritional info, and cooking times.
        </div>

        {!hasAccess && (
          <Button 
            onClick={handleClick}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium"
            disabled={loading}
          >
            <Lock className="w-4 h-4 mr-2" />
            Unlock Premium Recipes for $4.99/year
          </Button>
        )}

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
              <AlertDialogTitle>Unlock Premium AI Recipes</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Get yearly access to our curated collection of AI-generated gluten-free recipes for just <strong>$4.99</strong>!</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Breakfast recipes</li>
                  <li>Snack recipes</li>
                  <li>Lunch recipes</li>
                  <li>Dinner recipes</li>
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
      </CardContent>
    </Card>
  );
};