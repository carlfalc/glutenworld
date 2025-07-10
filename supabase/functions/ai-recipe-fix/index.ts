import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface Recipe {
  id: string;
  title: string;
  converted_recipe: string;
  instructions: string[];
  ingredients: any[];
}

Deno.serve(async (req) => {
  console.log('AI Recipe Fix function called!');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching recipes with consistency issues...');
    
    // Get recipes that likely have consistency issues
    const { data: recipes, error } = await supabaseClient
      .from('recipes')
      .select('id, title, converted_recipe, instructions, ingredients')
      .not('converted_recipe', 'is', null)
      .not('instructions', 'is', null)
      .limit(10);

    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }

    console.log(`Found ${recipes.length} recipes to analyze`);
    let updatedCount = 0;

    for (const recipe of recipes) {
      console.log(`Analyzing recipe: ${recipe.title}`);
      
      // Check if recipe needs fixing using AI
      const analysisPrompt = `
Analyze this recipe for consistency issues:

Title: ${recipe.title}
Converted Recipe: ${recipe.converted_recipe}
Instructions: ${JSON.stringify(recipe.instructions)}
Ingredients: ${JSON.stringify(recipe.ingredients)}

Look for these issues:
1. Title mentions specific protein (chicken, beef, lamb, etc.) but ingredients say "Main protein"
2. Instructions are too generic and don't match the specific protein in title
3. Missing rolling/cutting instructions for proteins that need them

Return JSON with:
{
  "needsFix": boolean,
  "issues": ["list of specific issues found"],
  "fixedRecipe": "corrected recipe text if fixes needed",
  "fixedInstructions": ["corrected instruction steps if fixes needed"],
  "fixedIngredients": [corrected ingredients array if fixes needed]
}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a recipe consistency expert. Always return valid JSON.' },
            { role: 'user', content: analysisPrompt }
          ],
          temperature: 0.3,
        }),
      });

      const aiResult = await response.json();
      const analysis = JSON.parse(aiResult.choices[0].message.content);

      if (analysis.needsFix) {
        console.log(`Fixing recipe ${recipe.id}: ${analysis.issues.join(', ')}`);
        
        const updateData: any = {};
        if (analysis.fixedRecipe) updateData.converted_recipe = analysis.fixedRecipe;
        if (analysis.fixedInstructions) updateData.instructions = analysis.fixedInstructions;
        if (analysis.fixedIngredients) updateData.ingredients = analysis.fixedIngredients;

        const { error: updateError } = await supabaseClient
          .from('recipes')
          .update(updateData)
          .eq('id', recipe.id);

        if (!updateError) {
          updatedCount++;
          console.log(`Successfully updated recipe ${recipe.id}`);
        } else {
          console.error(`Failed to update recipe ${recipe.id}:`, updateError);
        }
      } else {
        console.log(`Recipe ${recipe.id} is already consistent`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Recipe consistency check completed! Updated ${updatedCount} recipes out of ${recipes.length} analyzed.`,
        updatedCount,
        totalAnalyzed: recipes.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-recipe-fix function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to fix recipe consistency using AI'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});