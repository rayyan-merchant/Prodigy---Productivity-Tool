
import React from 'react';
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";

interface DashboardGreetingProps {
  greeting: string;
  quotes: string[];
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ greeting, quotes }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1 text-foreground">{greeting}</h1>
      <MotivationalQuote quotes={quotes} />
    </div>
  );
};

export default DashboardGreeting;
