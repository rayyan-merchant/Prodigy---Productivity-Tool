
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

/**
 * Firebase Cloud Function to call the Mistral API
 * This should run on the server side
 */
export const callMistralAi = functions.https.onCall(async (data: any, context) => {
  try {
    // Get API key from environment variables
    const apiKey = functions.config().mistral.api_key;
    
    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }

    // Get prompt and model from request data
    const { prompt, model = 'mistral-tiny' } = data;
    
    if (!prompt) {
      throw new Error('No prompt provided');
    }

    // Use the proxy endpoint provided by the user
    const response = await fetch('https://mistral-proxy-chi.vercel.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mistral API error: ${response.status}, ${error}`);
    }
    
    const result = await response.json();
    
    // Type assertion to ensure result has the expected structure
    if (typeof result === 'object' && result !== null && 'choices' in result) {
      const typedResult = result as { choices: Array<{ message: { content: string } }> };
      if (typedResult.choices && typedResult.choices.length > 0) {
        return {
          content: typedResult.choices[0].message.content
        };
      }
    }
    
    throw new Error('Invalid response from Mistral API');
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    throw new functions.https.HttpsError('internal', error instanceof Error ? error.message : 'Unknown error');
  }
});
