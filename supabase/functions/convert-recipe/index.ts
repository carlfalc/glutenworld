
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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing recipe conversion with OpenAI Vision API')

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

    const userPrompt = prompt || 'Please analyze this recipe image and convert it to a gluten-free version following the guidelines above.'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const convertedRecipe = data.choices[0].message.content

    console.log('Successfully converted recipe using OpenAI Vision')

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
