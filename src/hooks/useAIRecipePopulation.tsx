import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIRecipePopulation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [generatedRecipeCount, setGeneratedRecipeCount] = useState(0);
  const { toast } = useToast();

  // Check for existing progress on mount
  useEffect(() => {
    checkExistingProgress();
  }, []);

  const checkExistingProgress = async () => {
    try {
      const { data: progressData } = await supabase
        .from('recipe_generation_progress')
        .select('*')
        .in('status', ['pending', 'running', 'completed', 'timeout_restart_needed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (progressData) {
        setProgress(progressData);
        if (progressData.status === 'running' || progressData.status === 'pending') {
          setIsGenerating(true);
          // Start polling for progress updates
          pollProgress(progressData.id);
        } else if (progressData.status === 'timeout_restart_needed') {
          // Auto-restart after timeout
          setIsGenerating(true);
          toast({
            title: "Auto-restarting Generation",
            description: "Continuing recipe generation from where it left off...",
            variant: "default",
          });
          setTimeout(() => {
            generateAIRecipes().catch(console.error);
          }, 1000);
        } else if (progressData.status === 'completed') {
          // Check actual recipe count
          const { data: recipes } = await supabase
            .from('recipes')
            .select('id', { count: 'exact' })
            .is('user_id', null)
            .eq('is_public', true);
          
          setGeneratedRecipeCount(recipes?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error checking existing progress:', error);
    }
  };

  const pollProgress = async (progressId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data: progressData } = await supabase
          .from('recipe_generation_progress')
          .select('*')
          .eq('id', progressId)
          .single();

        if (progressData) {
          setProgress(progressData);
          
          if (progressData.status === 'completed') {
            setIsGenerating(false);
            clearInterval(interval);
            
            // Check actual recipe count
            const { data: recipes } = await supabase
              .from('recipes')
              .select('id', { count: 'exact' })
              .is('user_id', null)
              .eq('is_public', true);
            
            const recipeCount = recipes?.length || 0;
            setGeneratedRecipeCount(recipeCount);
            
            toast({
              title: "Recipe Generation Complete!",
              description: `Successfully generated ${recipeCount} AI-powered gluten-free recipes. You can now browse them!`,
              variant: "default",
            });
          } else if (progressData.status === 'failed') {
            setIsGenerating(false);
            clearInterval(interval);
            toast({
              title: "Generation Failed",
              description: progressData.error_message || "Recipe generation encountered an error.",
              variant: "destructive",
            });
          } else if (progressData.status === 'timeout_restart_needed') {
            clearInterval(interval);
            toast({
              title: "Auto-restarting Generation",
              description: "Generation paused due to timeout. Continuing from where it left off...",
              variant: "default",
            });
            
            // Auto-restart after a short delay
            setTimeout(async () => {
              try {
                await generateAIRecipes();
              } catch (restartError) {
                console.error('Error restarting generation:', restartError);
                setIsGenerating(false);
                toast({
                  title: "Restart Failed",
                  description: "Failed to auto-restart generation. Please try again manually.",
                  variant: "destructive",
                });
              }
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling progress:', error);
      }
    }, 3000); // Check every 3 seconds

    // Clean up interval after 30 minutes max
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
  };

  const generateAIRecipes = async (): Promise<any> => {
    console.log('=== AI Recipe Population starting! ===');
    console.log('Button clicked - function called');
    
    // Set generating state immediately for user feedback
    setIsGenerating(true);
    
    try {
      console.log('Invoking populate-recipes function...');
      
      const { data, error } = await supabase.functions.invoke('populate-recipes', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Raw response data:', data);
      console.log('Raw response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        setIsGenerating(false); // Reset generating state on error
        toast({
          title: "Error",
          description: `Failed to start recipe generation: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Function response:', data);
      
      if (data && data.error) {
        console.error('Function returned error:', data.error);
        setIsGenerating(false); // Reset generating state on error
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        throw new Error(data.error);
      }

      // Handle different response types
      if (data.already_completed) {
        setGeneratedRecipeCount(data.total_in_database || 0);
        toast({
          title: "Recipes Already Available!",
          description: data.message,
          variant: "default",
        });
      } else if (data.already_running) {
        setIsGenerating(true);
        setProgress(data.progress);
        pollProgress(data.progress_id);
        toast({
          title: "Generation In Progress",
          description: data.message,
          variant: "default",
        });
      } else if (data.started_in_background) {
        setIsGenerating(true);
        pollProgress(data.progress_id);
        toast({
          title: "Generation Started!",
          description: data.message,
          variant: "default",
        });
      }

      return data;
    } catch (error: any) {
      setIsGenerating(false); // Reset generating state on error
      console.error('Error in generateAIRecipes:', error);
      
      let errorMessage = "Failed to start recipe generation";
      if (error.message?.includes('Failed to fetch')) {
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
    }
  };

  return {
    generateAIRecipes,
    isGenerating,
    progress,
    generatedRecipeCount,
    checkExistingProgress,
  };
};