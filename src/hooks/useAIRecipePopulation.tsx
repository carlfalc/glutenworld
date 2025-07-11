import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIRecipePopulation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAIRecipes = async (): Promise<any> => {
    console.log('=== AI Recipe Population starting! ===');
    console.log('Button clicked - function called');
    
    setIsGenerating(true);
    console.log('Setting isGenerating to true...');
    console.log('isGenerating set to true, current state:', true);

    try {
      console.log('Invoking populate-recipes function...');
      
      const { data, error } = await supabase.functions.invoke('populate-recipes', {
        body: {},
      });

      if (error) {
        console.error('Error calling populate-recipes function:', error);
        toast({
          title: "Error",
          description: `Failed to generate recipes: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Function response:', data);
      
      toast({
        title: "Success!",
        description: data.message || `Generated ${data.total_generated || 0} AI-powered recipes`,
        variant: "default",
      });

      return data;
    } catch (error: any) {
      console.error('Error in generateAIRecipes:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate recipes",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
      console.log('Setting isGenerating to false...');
    }
  };

  return {
    generateAIRecipes,
    isGenerating,
  };
};