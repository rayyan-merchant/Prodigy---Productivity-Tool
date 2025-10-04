
import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Goal } from '@/types/goals';
import { getGoals } from '@/services/goalService';
import { useNavigate } from 'react-router-dom';

const GoalsProgress: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await getGoals();
        // Show only the top 3 most recent goals
        setGoals(fetchedGoals.slice(0, 3));
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-500 dark:text-green-400';
    if (percentage >= 70) return 'text-blue-500 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const handleNavigateToGoals = () => {
    navigate('/goals');
  };

  if (isLoading) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5" />
            Goals Progress
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleNavigateToGoals}>
            <Plus className="h-4 w-4 mr-1" />
            New Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentValue, goal.targetValue);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{goal.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${getProgressColor(progressPercentage)}`}>
                    <TrendingUp className="h-3 w-3" />
                    {progressPercentage.toFixed(0)}%
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No goals set yet</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleNavigateToGoals}>
                <Plus className="h-4 w-4 mr-1" />
                Create your first goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
