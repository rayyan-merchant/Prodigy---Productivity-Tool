
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import NoDataPlaceholder from "@/components/analytics/NoDataPlaceholder";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface TaskChartData {
  date: string;
  tasks: number;
}

interface TaskCompletionChartProps {
  isLoading: boolean;
  taskData: TaskChartData[];
  totalCompletedTasks: number;
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ isLoading, taskData, totalCompletedTasks }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Task Completion</CardTitle>
          {!isLoading && taskData && taskData.length > 0 && (
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Top: {Math.max(...taskData.map(d => d.tasks))} Tasks</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Average: {(totalCompletedTasks / Math.max(1, taskData.length)).toFixed(1)} Tasks</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <LoadingSkeleton type="chart" />
        ) : taskData && taskData.length > 0 ? (
          <ChartContainer config={{ bar: { color: "#3b82f6" } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <NoDataPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCompletionChart;
