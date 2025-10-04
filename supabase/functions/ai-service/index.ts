
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  prompt: string;
  type: 'productivity-tips' | 'motivational-quote' | 'analyze-priorities' | 'summarize-notes' | 'ask-about-note' | 'summarize-note' | 'weekly-insights' | 'generate-title-tags' | 'prioritize-tasks';
  context?: any;
  maxTokens?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('AI API')
    
    if (!apiKey) {
      throw new Error('AI API key not configured')
    }

    const { prompt, type, context, maxTokens = 1000 }: AIRequest = await req.json()
    
    if (!prompt) {
      throw new Error('No prompt provided')
    }

    console.log(`Processing AI request of type: ${type}`)

    // Use Groq API with a supported model - updated to supported model
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Updated to a supported model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    })

    console.log('Received response status:', response.status)

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`
      try {
        const errorData = await response.json()
        console.error('Error data:', errorData)
        errorMessage = errorData?.error?.message || errorMessage
      } catch (parseError) {
        console.error('Error parsing error response:', parseError)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('AI response received for type:', type)
    
    const reply = data.choices[0]?.message?.content || ''

    // Handle special response formats for certain types
    if (type === 'summarize-note') {
      try {
        // Try to parse JSON response for structured summary
        const parsedResponse = JSON.parse(reply.trim())
        return new Response(JSON.stringify({ 
          success: true, 
          data: parsedResponse 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch {
        // Fallback for non-JSON response
        return new Response(JSON.stringify({ 
          success: true, 
          data: {
            tldr: reply.substring(0, 100),
            bullets: ["Could not parse structured response", "Please try again"],
            formal: "Could not generate formal summary due to formatting issues."
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (type === 'generate-title-tags') {
      try {
        const parsedResponse = JSON.parse(reply.trim())
        return new Response(JSON.stringify({ 
          success: true, 
          data: {
            title: parsedResponse.title || "",
            tags: Array.isArray(parsedResponse.tags) ? parsedResponse.tags : []
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch {
        return new Response(JSON.stringify({ 
          success: true, 
          data: { title: "", tags: [] }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (type === 'prioritize-tasks') {
      try {
        const jsonMatch = reply.match(/\[[\s\S]*\]/)
        const parsedIds = jsonMatch ? JSON.parse(jsonMatch[0]) : []
        return new Response(JSON.stringify({ 
          success: true, 
          data: Array.isArray(parsedIds) ? parsedIds : []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch {
        return new Response(JSON.stringify({ 
          success: true, 
          data: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: reply 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in ai-service function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: 'Sorry, I encountered an error processing your request. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
