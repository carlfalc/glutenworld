import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { useAddToFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';

const DebugRecipeSave = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createRecipeMutation = useCreateRecipe();
  const addToFavoritesMutation = useAddToFavorites();
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRecipeSave = async () => {
    setDebugLog([]);
    addLog('🚀 Starting recipe save test...');
    
    // Check authentication
    if (!user) {
      addLog('❌ USER NOT AUTHENTICATED');
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to save recipes",
        variant: "destructive",
      });
      return;
    }
    
    addLog(`✅ User authenticated: ${user.email} (ID: ${user.id})`);

    // Test recipe data
    const testRecipe = {
      title: 'Test Gluten-Free Recipe',
      original_recipe: 'This is a test recipe with gluten',
      converted_recipe: 'This is the gluten-free version of the test recipe',
      ingredients: ['Test ingredient 1', 'Test ingredient 2'],
      instructions: ['Step 1: Test', 'Step 2: More testing'],
      servings: 4,
      prep_time: 15,
      cook_time: 30,
      calories_per_serving: 250,
      protein_g: 10,
      carbs_g: 30,
      fat_g: 8,
      difficulty_level: 'Medium' as const,
      is_public: false
    };

    addLog('📝 Test recipe data prepared');

    try {
      addLog('💾 Attempting to save recipe to user_recipes...');
      
      // Save to user_recipes
      const result = await new Promise((resolve, reject) => {
        createRecipeMutation.mutate(testRecipe, {
          onSuccess: (data) => {
            addLog(`✅ Recipe saved successfully! ID: ${data.id}`);
            resolve(data);
          },
          onError: (error) => {
            addLog(`❌ Recipe save failed: ${JSON.stringify(error)}`);
            reject(error);
          }
        });
      });

      // If recipe save successful, try to add to favorites
      addLog('⭐ Attempting to add to favorites...');
      
      await new Promise((resolve, reject) => {
        addToFavoritesMutation.mutate({
          type: 'recipe',
          recipe_id: (result as any).id,
          product_name: testRecipe.title,
          product_description: testRecipe.converted_recipe,
          product_category: 'ai-generated-recipe',
          product_scanned_at: new Date().toISOString(),
        }, {
          onSuccess: (data) => {
            addLog(`✅ Added to favorites successfully! ID: ${data.id}`);
            resolve(data);
          },
          onError: (error) => {
            addLog(`❌ Add to favorites failed: ${JSON.stringify(error)}`);
            reject(error);
          }
        });
      });

      addLog('🎉 ALL TESTS PASSED! Recipe save functionality is working.');
      toast({
        title: "Test Successful",
        description: "Recipe save functionality is working correctly!",
      });

    } catch (error) {
      addLog(`💥 TEST FAILED: ${JSON.stringify(error)}`);
      toast({
        title: "Test Failed",
        description: "Recipe save functionality has issues - check debug log",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🔧 Recipe Save Debug Tool</h3>
      
      <Button 
        onClick={testRecipeSave}
        className="mb-4"
        disabled={createRecipeMutation.isPending || addToFavoritesMutation.isPending}
      >
        {createRecipeMutation.isPending || addToFavoritesMutation.isPending 
          ? 'Testing...' 
          : 'Test Recipe Save'
        }
      </Button>
      
      <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-96 overflow-y-auto">
        {debugLog.length === 0 ? (
          <div>Click "Test Recipe Save" to start debugging...</div>
        ) : (
          debugLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugRecipeSave;