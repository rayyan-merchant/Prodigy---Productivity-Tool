
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NoDataPlaceholder from "@/components/analytics/NoDataPlaceholder";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface ProjectTimeData {
  name: string;
  value: number;
}

interface ProjectTimeDistributionProps {
  isLoading: boolean;
  projectTimeData: ProjectTimeData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProjectTimeDistribution: React.FC<ProjectTimeDistributionProps> = ({ isLoading, projectTimeData }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Time Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <LoadingSkeleton type="chart" />
        ) : projectTimeData && projectTimeData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectTimeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}h`}
              >
                {projectTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}h`, 'Time Spent']} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <NoDataPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeDistribution;
