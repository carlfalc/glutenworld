
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ConvertRecipeParams {
  imageBase64: string;
  prompt?: string;
}

export const useRecipeConversion = () => {
  return useMutation({
    mutationFn: async ({ imageBase64, prompt }: ConvertRecipeParams) => {
      const { data, error } = await supabase.functions.invoke('convert-recipe', {
        body: { imageBase64, prompt }
      });

      if (error) throw error;
      return data;
    },
  });
};
