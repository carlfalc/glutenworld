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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all recipes with content
    const { data: recipes, error } = await supabaseClient
      .from('recipes')
      .select('id, title, converted_recipe, instructions, ingredients')
      .not('converted_recipe', 'is', null)
      .not('instructions', 'is', null)

    if (error) {
      throw error
    }

    console.log(`Processing ${recipes.length} recipes for consistency fixes...`)

    const updates = []
    let fixedCount = 0

    for (const recipe of recipes) {
      let needsUpdate = false
      let newTitle = recipe.title
      let newInstructions = [...recipe.instructions]
      let newIngredients = recipe.ingredients ? [...recipe.ingredients] : []

      // Check if title mentions specific protein but ingredients are generic
      const titleLower = recipe.title.toLowerCase()
      let specificProtein = null
      
      if (titleLower.includes('chicken')) {
        specificProtein = 'chicken'
      } else if (titleLower.includes('beef')) {
        specificProtein = 'beef'
      } else if (titleLower.includes('pork')) {
        specificProtein = 'pork'
      } else if (titleLower.includes('lamb')) {
        specificProtein = 'lamb'
      } else if (titleLower.includes('salmon')) {
        specificProtein = 'salmon'
      } else if (titleLower.includes('fish')) {
        specificProtein = 'fish'
      } else if (titleLower.includes('shrimp')) {
        specificProtein = 'shrimp'
      } else if (titleLower.includes('turkey')) {
        specificProtein = 'turkey'
      }

      if (specificProtein) {
        // Check if ingredients have generic "main protein"
        const hasGenericProtein = recipe.ingredients?.some((ing: any) => 
          ing.name?.toLowerCase().includes('main protein') ||
          ing.name?.toLowerCase().includes('protein of choice')
        )

        if (hasGenericProtein) {
          // Update ingredients to use specific protein
          newIngredients = newIngredients.map((ing: any) => {
            if (ing.name?.toLowerCase().includes('main protein')) {
              return { ...ing, name: ing.name.replace(/main protein/i, specificProtein) }
            }
            if (ing.name?.toLowerCase().includes('protein of choice')) {
              return { ...ing, name: ing.name.replace(/protein of choice/i, specificProtein) }
            }
            return ing
          })
          needsUpdate = true
        }

        // Check if instructions have generic "protein" references
        const hasGenericInstructions = recipe.instructions.some((inst: string) => 
          inst.toLowerCase().includes('season protein') ||
          inst.toLowerCase().includes('cook protein')
        )

        if (hasGenericInstructions) {
          // Update instructions to use specific protein
          newInstructions = newInstructions.map((inst: string) => {
            let newInst = inst.replace(/season protein/gi, `season ${specificProtein}`)
            newInst = newInst.replace(/cook protein/gi, `cook ${specificProtein}`)
            return newInst
          })
          needsUpdate = true
        }
      }

      // Check if title contains protein but ingredients have protein choice
      const hasProteinChoice = recipe.ingredients?.some((ing: any) => 
        ing.name?.toLowerCase().includes('protein of choice') ||
        ing.name?.toLowerCase().includes('chicken, fish, or tofu') ||
        ing.name?.toLowerCase().includes('(chicken, fish,')
      )

      if (hasProteinChoice && !recipe.title.toLowerCase().includes('with protein')) {
        // Add "with Protein" to titles that have protein choices
        if (recipe.title.toLowerCase().includes('dip') || 
            recipe.title.toLowerCase().includes('sauce') ||
            recipe.title.toLowerCase().includes('bowl') ||
            recipe.title.toLowerCase().includes('salad')) {
          newTitle = recipe.title.replace(/^([^-]+)/, '$1 with Protein')
          needsUpdate = true
        }
      }

      // Check for "bites", "balls", "energy balls" titles that need rolling instructions
      const needsRolling = (
        recipe.title.toLowerCase().includes('bites') ||
        recipe.title.toLowerCase().includes('balls') ||
        recipe.title.toLowerCase().includes('energy balls')
      ) && !recipe.instructions.some((inst: string) => 
        inst.toLowerCase().includes('roll') || 
        inst.toLowerCase().includes('form') ||
        inst.toLowerCase().includes('shape')
      )

      if (needsRolling) {
        // Add rolling instruction before serving
        const lastIndex = newInstructions.length - 1
        const servingInstruction = newInstructions[lastIndex]
        
        if (servingInstruction.toLowerCase().includes('serve')) {
          newInstructions[lastIndex] = 'Roll mixture into bite-sized balls using your hands or a small scoop'
          newInstructions.push(servingInstruction)
        } else {
          newInstructions.push('Roll mixture into bite-sized balls using your hands or a small scoop')
        }
        needsUpdate = true
      }

      // Check for "crackers", "chips", "bars" that need cutting/shaping instructions
      const needsCutting = (
        recipe.title.toLowerCase().includes('crackers') ||
        recipe.title.toLowerCase().includes('chips') ||
        recipe.title.toLowerCase().includes('bars')
      ) && !recipe.instructions.some((inst: string) => 
        inst.toLowerCase().includes('cut') || 
        inst.toLowerCase().includes('slice') ||
        inst.toLowerCase().includes('break')
      )

      if (needsCutting) {
        const lastIndex = newInstructions.length - 1
        const servingInstruction = newInstructions[lastIndex]
        
        if (servingInstruction.toLowerCase().includes('serve')) {
          if (recipe.title.toLowerCase().includes('crackers')) {
            newInstructions[lastIndex] = 'Cut into small cracker-sized squares'
          } else if (recipe.title.toLowerCase().includes('chips')) {
            newInstructions[lastIndex] = 'Break or cut into chip-sized pieces'
          } else if (recipe.title.toLowerCase().includes('bars')) {
            newInstructions[lastIndex] = 'Cut into rectangular bar shapes'
          }
          newInstructions.push(servingInstruction)
        } else {
          if (recipe.title.toLowerCase().includes('crackers')) {
            newInstructions.push('Cut into small cracker-sized squares')
          } else if (recipe.title.toLowerCase().includes('chips')) {
            newInstructions.push('Break or cut into chip-sized pieces')
          } else if (recipe.title.toLowerCase().includes('bars')) {
            newInstructions.push('Cut into rectangular bar shapes')
          }
        }
        needsUpdate = true
      }

      if (needsUpdate) {
        updates.push({
          id: recipe.id,
          title: newTitle,
          instructions: newInstructions,
          ingredients: newIngredients
        })
        fixedCount++
      }
    }

    // Batch update recipes
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} recipes...`)
      
      for (const update of updates) {
        const { error: updateError } = await supabaseClient
          .from('recipes')
          .update({
            title: update.title,
            instructions: update.instructions,
            ingredients: update.ingredients
          })
          .eq('id', update.id)

        if (updateError) {
          console.error(`Error updating recipe ${update.id}:`, updateError)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fixed consistency issues in ${fixedCount} recipes`,
        totalProcessed: recipes.length,
        updatesApplied: updates.length,
        details: {
          proteinTitleFixes: updates.filter(u => u.title.includes('with Protein')).length,
          shapingInstructionFixes: updates.filter(u => 
            u.instructions.some(inst => 
              inst.includes('Roll') || inst.includes('Cut') || inst.includes('Break')
            )
          ).length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})