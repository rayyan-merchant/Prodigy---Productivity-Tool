
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import NoDataPlaceholder from "@/components/analytics/NoDataPlaceholder";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface FocusChartData {
  date: string;
  hours: number;
}

interface FocusTimeChartProps {
  isLoading: boolean;
  focusData: FocusChartData[];
  totalFocusTime: number;
}

const FocusTimeChart: React.FC<FocusTimeChartProps> = ({ isLoading, focusData, totalFocusTime }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Focus Time Chart</CardTitle>
          {!isLoading && focusData && focusData.length > 0 && (
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Top: {Math.max(...focusData.map(d => d.hours))}h</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Average: {(totalFocusTime / Math.max(1, focusData.length)).toFixed(1)}h</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <LoadingSkeleton type="chart" />
        ) : focusData && focusData.length > 0 ? (
          <ChartContainer config={{ line: { color: "#D2353E" } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  strokeWidth={2} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <NoDataPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};

export default FocusTimeChart;
