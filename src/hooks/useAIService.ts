import { useState } from 'react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useAIService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (prompt: string, maxTokens: number = 1000): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Calling AI with prompt:', prompt);

      const apiKey = import.meta.env.VITE_MISTRAL_API_KEY; // ✅ Load from .env
      if (!apiKey) {
        throw new Error("MISTRAL API Key not found. Please set VITE_MISTRAL_API_KEY in .env");
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      console.log('Received response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error data:', errorData);
          errorMessage = errorData?.error?.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('AI response received:', data);

      const reply = data.choices[0]?.message?.content || '';

      return reply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI service error:', err);
      toast.error(`AI service error: ${errorMessage}`);
      return 'Sorry, I encountered an error processing your request. Please try again later.';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callAI,
    isLoading,
    error,
  };
};
