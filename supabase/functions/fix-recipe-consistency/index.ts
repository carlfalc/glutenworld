import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Recipe {
  id: string
  title: string
  converted_recipe: string
  instructions: string[]
  ingredients: any[]
}

serve(async (req) => {
  console.log('Fix recipe consistency function called!')
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing request...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get ALL recipes that need consistency fixes
    const { data: recipes, error } = await supabaseClient
      .from('recipes')
      .select('id, title, converted_recipe, instructions, ingredients, original_recipe')
      .not('converted_recipe', 'is', null)
      .not('instructions', 'is', null)

    if (error) {
      console.error('Error fetching recipes:', error)
      throw error
    }

    console.log(`Found ${recipes.length} recipes to analyze and fix...`)
    
    let updatesApplied = 0
    const processingResults = []

    // Process recipes in batches to avoid timeouts
    const batchSize = 10
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize)
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(recipes.length/batchSize)}`)
      
      for (const recipe of batch) {
        try {
          console.log(`Analyzing recipe: ${recipe.title}`)
          
          // Create detailed prompt for AI analysis
          const analysisPrompt = `You are a professional recipe consistency analyst. Analyze this gluten-free recipe for inconsistencies and provide detailed fixes.

RECIPE TO ANALYZE:
Title: ${recipe.title}
Original Recipe: ${recipe.original_recipe || 'Not provided'}
Converted Recipe: ${recipe.converted_recipe}
Instructions: ${JSON.stringify(recipe.instructions)}
Ingredients: ${JSON.stringify(recipe.ingredients)}

ANALYSIS REQUIREMENTS:
1. Check ingredient consistency between original and converted recipes
2. Verify gluten-free substitutions are accurate and complete
3. Ensure instruction steps match the ingredients listed
4. Identify missing cooking times, temperatures, or quantities
5. Check for proper gluten-free alternatives (e.g., almond flour instead of wheat flour)

PROVIDE FIXES IN THIS EXACT FORMAT:
{
  "needsFixes": true/false,
  "issues": [
    {
      "type": "ingredient_inconsistency" | "instruction_mismatch" | "gluten_substitution" | "missing_detail",
      "description": "Detailed description of the issue",
      "currentValue": "What is currently wrong",
      "suggestedFix": "Exact replacement or addition needed"
    }
  ],
  "fixedIngredients": [...] (if ingredients need updating),
  "fixedInstructions": [...] (if instructions need updating),
  "fixedConvertedRecipe": "..." (if converted recipe text needs updating)
}

Example fixes you should look for:
- "2 cups flour" should be "2 cups gluten-free flour blend"
- Missing cooking temperatures or times
- Ingredients mentioned in instructions but not in ingredient list
- Gluten-containing ingredients not properly substituted
- Inconsistent measurements or quantities`

          const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { 
                  role: 'system', 
                  content: 'You are an expert recipe consistency analyst specializing in gluten-free cooking. Provide detailed, actionable fixes for recipe inconsistencies.' 
                },
                { role: 'user', content: analysisPrompt }
              ],
              temperature: 0.3,
              max_tokens: 2000
            }),
          })

          if (!openAIResponse.ok) {
            console.error(`OpenAI API error for recipe ${recipe.id}:`, await openAIResponse.text())
            continue
          }

          const aiResult = await openAIResponse.json()
          const analysisText = aiResult.choices[0].message.content

          console.log(`AI Analysis for ${recipe.title}:`, analysisText)

          // Try to parse the AI response as JSON
          let analysis
          try {
            // Extract JSON from the response if it's wrapped in text
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              analysis = JSON.parse(jsonMatch[0])
            } else {
              analysis = JSON.parse(analysisText)
            }
          } catch (e) {
            console.log('Could not parse AI response as JSON, treating as text analysis')
            analysis = { needsFixes: false, rawAnalysis: analysisText }
          }

          processingResults.push({
            recipeId: recipe.id,
            title: recipe.title,
            analysis: analysis
          })

          // Apply fixes if needed
          if (analysis.needsFixes) {
            const updateData: any = {}
            
            if (analysis.fixedIngredients) {
              updateData.ingredients = analysis.fixedIngredients
            }
            
            if (analysis.fixedInstructions) {
              updateData.instructions = analysis.fixedInstructions
            }
            
            if (analysis.fixedConvertedRecipe) {
              updateData.converted_recipe = analysis.fixedConvertedRecipe
            }

            if (Object.keys(updateData).length > 0) {
              updateData.updated_at = new Date().toISOString()
              
              const { error: updateError } = await supabaseClient
                .from('recipes')
                .update(updateData)
                .eq('id', recipe.id)

              if (updateError) {
                console.error(`Error updating recipe ${recipe.id}:`, updateError)
              } else {
                updatesApplied++
                console.log(`Successfully updated recipe: ${recipe.title}`)
              }
            }
          }

        } catch (error) {
          console.error(`Error processing recipe ${recipe.id}:`, error)
          processingResults.push({
            recipeId: recipe.id,
            title: recipe.title,
            error: error.message
          })
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Recipe consistency analysis completed`,
        totalRecipesAnalyzed: recipes.length,
        updatesApplied: updatesApplied,
        processingResults: processingResults.slice(0, 10), // Show first 10 results
        summary: `Analyzed ${recipes.length} recipes and applied ${updatesApplied} fixes`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in fix-recipe-consistency function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to fix recipe consistency'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})