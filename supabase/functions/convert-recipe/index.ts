
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageBase64, prompt } = await req.json()
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')

    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured')
    }

    const recipePrompt = `${prompt || 'Analyze this recipe image and convert it to a gluten-free version.'} 

Please provide:
1. Original recipe title
2. Original ingredients list
3. Gluten-free alternative ingredients with exact substitutions
4. Modified cooking instructions if needed
5. Preparation time and cooking time
6. Difficulty level (Easy/Medium/Hard)
7. Number of servings

Format the response as a structured recipe that's easy to read and follow. Focus on practical gluten-free substitutions that maintain the taste and texture of the original dish.

Image: ${imageBase64}`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a expert chef specializing in gluten-free cooking. Analyze recipe images and provide detailed gluten-free conversions with practical substitutions.'
          },
          {
            role: 'user',
            content: recipePrompt
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const data = await response.json()
    const convertedRecipe = data.choices[0].message.content

    return new Response(
      JSON.stringify({ convertedRecipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in convert-recipe function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
