
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

    const systemPrompt = `You are an AI culinary expert tasked with analyzing a given recipe for gluten content. Your objectives are as follows:

1. Identify whether the provided recipe contains gluten. Highlight any ingredients that are sources of gluten.
2. Create a modified gluten-free version of the recipe. Ensure that all ingredients are gluten-free and provide a complete list of these ingredients.
3. Outline each step of the modified recipe, detailing the procedure to prepare the gluten-free dish.
4. Clearly indicate which ingredients were replaced to make the recipe gluten-free and specify what was added, if any, that was not in the original recipe.

**Output Format:**
- **Gluten Analysis:** Identification of gluten-containing ingredients
- **Gluten-Free Ingredients:** A complete list of gluten-free ingredients for the modified recipe
- **Instructions:** Step-by-step instructions for preparing the gluten-free version
- **Changes Summary:** Which ingredients were replaced and what new ingredients were added

Format the response as a structured recipe that's easy to read and follow. Focus on practical gluten-free substitutions that maintain the taste and texture of the original dish.`

    const userPrompt = `${prompt || 'Please analyze this recipe image and convert it to a gluten-free version following the guidelines above.'}

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
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
