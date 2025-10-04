import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { getMotivationalQuote } from '@/services/supabaseAiService';

interface MotivationalQuoteProps {
  // Making initialQuote and quotes optional
  initialQuote?: string;
  quotes?: string[];
}

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ 
  initialQuote,
  quotes = [] 
}) => {
  const [quote, setQuote] = useState<string>(initialQuote || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNewQuote = async () => {
    setIsLoading(true);
    try {
      // If quotes array is provided and not empty, use it
      if (quotes && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from Supabase AI service
      const newQuote = await getMotivationalQuote();
      setQuote(newQuote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch quote when component mounts
  useEffect(() => {
    if (!initialQuote) {
      fetchNewQuote();
    }
    
    // Set up interval to fetch new quote every 5 minutes
    const interval = setInterval(() => {
      fetchNewQuote();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [initialQuote]);

  return (
    <Card className="w-full stat-card hover:border-primary/40">
      <CardContent className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium dark:text-gray-100">Today's Motivation</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchNewQuote}
            disabled={isLoading}
            aria-label="Refresh quote"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center text-center">
          {isLoading ? (
            <p className="text-muted-foreground italic">Loading motivation...</p>
          ) : (
            <p className="text-lg font-medium dark:text-gray-100">"{quote.trim()}"</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
