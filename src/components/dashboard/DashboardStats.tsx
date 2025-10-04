
import React from 'react';
import { CheckCircle, Clock, BarChart } from "lucide-react";
import StatsCard from "@/components/StatsCard";

interface DashboardStatsProps {
  stats: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
  }>;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
