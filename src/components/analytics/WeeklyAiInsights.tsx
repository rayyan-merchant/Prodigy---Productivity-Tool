
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateWeeklyInsights } from '@/services/supabaseAiService';
import { useToast } from '@/hooks/use-toast';

interface WeeklyAiInsightsProps {
  completedTasks: number;
  focusHours: number;
  sessionsCompleted: number;
}

const WeeklyAiInsights: React.FC<WeeklyAiInsightsProps> = ({ 
  completedTasks, 
  focusHours,
  sessionsCompleted
}) => {
  const [insight, setInsight] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const { toast } = useToast();
  
  // Auto-generate insights if we have data
  useEffect(() => {
    const shouldGenerate = completedTasks > 0 || focusHours > 0;
    
    if (shouldGenerate && !hasAttemptedGeneration) {
      generateInsights();
      setHasAttemptedGeneration(true);
    }
  }, [completedTasks, focusHours]);
  
  const generateInsights = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      const result = await generateWeeklyInsights({
        completedTasks,
        focusHours,
        sessionsCompleted
      });
      
      setInsight(result);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI insights",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly AI Insights</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={generateInsights}
          disabled={isGenerating || (completedTasks === 0 && focusHours === 0)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Analyzing...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : insight ? (
          <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
            <p className="text-sm italic">{insight}</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4">
            {completedTasks === 0 && focusHours === 0 ? (
              <p>Complete tasks or focus sessions to generate AI insights</p>
            ) : (
              <p>Click "Refresh" to generate insights about your week</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyAiInsights;
