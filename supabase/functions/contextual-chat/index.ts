
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
    const { message, systemPrompt, chatMode, servingSize, context } = await req.json()
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing contextual chat request:', { chatMode, servingSize, message: message.substring(0, 100) })

    // Enhanced system prompt with context
    const enhancedSystemPrompt = `${systemPrompt}

CURRENT CONTEXT:
- Chat Mode: ${chatMode}
- Serving Size: ${servingSize || 'Not specified'}
- Additional Context: ${JSON.stringify(context)}

Remember to:
1. Stay in character as GlutenConvert
2. Always prioritize gluten-free safety
3. Be encouraging and helpful
4. Provide specific, actionable advice
5. Use the serving size information when creating recipes
6. Format recipes clearly with the specified structure when in recipe-creator mode`

    // Check if the message contains an image (base64 data URL)
    const isImageMessage = message.includes('data:image/')
    
    let messages
    
    if (isImageMessage && chatMode === 'ingredient-scan') {
      // Extract the base64 image from the message
      const imageMatch = message.match(/data:image\/[^;]+;base64,([^"]+)/)
      if (imageMatch) {
        const imageBase64 = `data:image/jpeg;base64,${imageMatch[1]}`
        const textContent = message.replace(/data:image\/[^"]+/g, '').trim()
        
        messages = [
          {
            role: 'system',
            content: enhancedSystemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: textContent || 'Please analyze this ingredient label image for gluten content and safety.'
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
        ]
      } else {
        // Fallback to text-only if image extraction fails
        messages = [
          {
            role: 'system',
            content: enhancedSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ]
      }
    } else {
      // Text-only message
      messages = [
        {
          role: 'system',
          content: enhancedSystemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ]
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    console.log('Successfully processed contextual chat request with OpenAI')

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in contextual-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
