
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Clock, CalendarDays } from "lucide-react";

interface ProductivityInsightsProps {
  isLoading: boolean;
  filteredSessions: any[];
  filteredTasks: any[];
  totalCompletedTasks: number;
  totalFocusTime: number;
  dateRange: '7d' | '30d' | '90d' | 'all';
  focusData: Array<{date: string, hours: number}>;
  aiInsight?: string;
}

const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({ 
  isLoading, 
  filteredSessions, 
  filteredTasks, 
  totalCompletedTasks,
  totalFocusTime,
  dateRange,
  focusData,
  aiInsight
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : filteredSessions.length > 0 || filteredTasks.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <p className="text-sm">
                {filteredTasks.length > 0 
                  ? `You've completed ${totalCompletedTasks} tasks ${dateRange === '7d' ? 'this week' : 
                      dateRange === '30d' ? 'this month' : 
                      dateRange === '90d' ? 'in the past 3 months' : 
                      'in total'}.`
                  : 'Complete tasks to see your productivity insights.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <p className="text-sm">
                {filteredSessions.length > 0 
                  ? `You've spent ${totalFocusTime.toFixed(1)} hours in focused work ${dateRange === '7d' ? 'this week' : 
                      dateRange === '30d' ? 'this month' : 
                      dateRange === '90d' ? 'in the past 3 months' : 
                      'in total'}.`
                  : 'Complete Pomodoro sessions to see focus time insights.'}
              </p>
            </div>
            {focusData.length > 1 && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-500" />
                <p className="text-sm">
                  {`Your most productive day was ${focusData.sort((a, b) => b.hours - a.hours)[0].date} with ${focusData.sort((a, b) => b.hours - a.hours)[0].hours} hours of focused work.`}
                </p>
              </div>
            )}
            {aiInsight && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                <p className="text-sm italic">{aiInsight}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Complete tasks and Pomodoro sessions to see productivity insights.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductivityInsights;
