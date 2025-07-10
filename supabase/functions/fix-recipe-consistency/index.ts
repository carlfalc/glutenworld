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
    
    // Quick test response to verify function is working
    const body = await req.text()
    console.log('Request body:', body)
    
    if (body.includes('"test":true')) {
      console.log('Test mode - returning quick response')
      return new Response(
        JSON.stringify({
          success: true,
          message: "Function is working! Test completed successfully.",
          updatesApplied: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    console.log('Starting actual recipe processing...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get a small sample first to test
    const { data: recipes, error } = await supabaseClient
      .from('recipes')
      .select('id, title, converted_recipe, instructions, ingredients')
      .not('converted_recipe', 'is', null)
      .not('instructions', 'is', null)
      .limit(5) // Just test with 5 recipes first

    if (error) {
      console.error('Error fetching recipes:', error)
      throw error
    }

    console.log(`Processing ${recipes.length} test recipes...`)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Test completed - found ${recipes.length} recipes to process`,
        updatesApplied: 0,
        totalProcessed: recipes.length
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