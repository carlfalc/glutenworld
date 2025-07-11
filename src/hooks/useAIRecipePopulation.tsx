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
      
      // Increased timeout for longer generation process
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
      
      const { data, error } = await supabase.functions.invoke('populate-recipes', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeout);

      console.log('Raw response data:', data);
      console.log('Raw response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's a network error
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          toast({
            title: "Network Error",
            description: "Unable to connect to the server. Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to generate recipes: ${error.message}`,
            variant: "destructive",
          });
        }
        throw error;
      }

      console.log('Function response:', data);
      
      // Handle both success and error responses from the function
      if (data && data.error) {
        console.error('Function returned error:', data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        throw new Error(data.error);
      }
      
      toast({
        title: "Success!",
        description: data?.message || `Generated ${data?.total_generated || 0} AI-powered recipes`,
        variant: "default",
      });

      return data;
    } catch (error: any) {
      console.error('Error in generateAIRecipes:', error);
      console.error('Error stack:', error.stack);
      
      // More specific error handling
      let errorMessage = "Failed to generate recipes";
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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