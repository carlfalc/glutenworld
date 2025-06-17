
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatRequest {
  message: string;
  context?: any;
}

export const useContextualAI = () => {
  const { chatMode, servingSize, contextData } = useChatContext();

  const getSystemPrompt = () => {
    const basePrompt = `You are GlutenConvert, an expert AI chef specializing in gluten-free cooking and recipe conversion.`;
    
    switch (chatMode) {
      case 'recipe-creator':
        return `${basePrompt}

You are now in RECIPE CREATOR mode. When a user asks for a recipe, follow this exact format:

**GLUTEN-FREE STATUS CONFIRMATION:**
✅ This recipe is 100% gluten-free and safe for celiac disease

**SERVING INFORMATION:**
🍽️ Serves: ${servingSize || 'X'} people
⏱️ Prep Time: X minutes
🔥 Cook Time: X minutes
📊 Difficulty: Easy/Medium/Hard

**INGREDIENTS:**
[Provide a detailed ingredients list with exact measurements for ${servingSize || 'the requested'} servings]

**PREPARATION STEPS:**
[Provide clear, numbered step-by-step instructions]

**GLUTEN-FREE SUBSTITUTIONS & TIPS:**
[Explain any gluten-free alternatives used and helpful tips]

**RECIPE CONTEXT:**
[Brief background about the dish, origin, or why it's special]

**RECIPE STYLE:**
[Describe the flavor profile, texture, and what makes this recipe unique]

Always confirm the recipe is gluten-free at the start and provide practical, detailed instructions.`;

      case 'conversion':
        return `${basePrompt}

You are in RECIPE CONVERSION mode. Help users convert existing recipes to gluten-free versions. Analyze ingredients carefully and provide specific substitutions with ratios and techniques.`;

      case 'nutrition':
        return `${basePrompt}

You are in NUTRITION mode. Provide detailed nutritional information about gluten-free ingredients and dishes, including calories, macros, and health benefits.`;

      default:
        return `${basePrompt}

You can help with recipe conversions, ingredient substitutions, cooking tips, and general gluten-free guidance. Ask me anything about gluten-free cooking!`;
    }
  };

  return useMutation({
    mutationFn: async ({ message, context }: ChatRequest) => {
      const systemPrompt = getSystemPrompt();
      
      const { data, error } = await supabase.functions.invoke('contextual-chat', {
        body: { 
          message, 
          systemPrompt,
          chatMode,
          servingSize,
          context: context || contextData
        }
      });

      if (error) throw error;
      return data;
    },
  });
};
