
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
}

export const useSupabaseAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (
    prompt: string, 
    type: string = 'general',
    context?: any,
    maxTokens: number = 1000
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Calling Supabase AI with prompt:', prompt);
      
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-service', {
        body: {
          prompt,
          type,
          context,
          maxTokens
        }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message || 'AI service error');
      }

      console.log('Supabase AI response received:', data);

      const response = data as AIResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'AI service returned an error');
      }

      return response.data;
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
    error
  };
};
