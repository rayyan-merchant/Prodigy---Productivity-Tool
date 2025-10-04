
import React from 'react';
import { Button } from "@/components/ui/button";

type DateRange = '7d' | '30d' | '90d' | 'all';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={dateRange === '7d' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setDateRange('7d')}
      >
        7 Days
      </Button>
      <Button 
        variant={dateRange === '30d' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setDateRange('30d')}
      >
        30 Days
      </Button>
      <Button 
        variant={dateRange === '90d' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setDateRange('90d')}
      >
        90 Days
      </Button>
      <Button 
        variant={dateRange === 'all' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => setDateRange('all')}
      >
        All Time
      </Button>
    </div>
  );
};

export default DateRangeSelector;
