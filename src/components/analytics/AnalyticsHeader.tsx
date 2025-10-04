
import React from 'react';
import DateRangeSelector from './DateRangeSelector';

type DateRangeType = '7d' | '30d' | '90d' | 'all';

interface AnalyticsHeaderProps {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ dateRange, setDateRange }) => {
  return (
    <>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="flex justify-end">
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>
    </>
  );
};

export default AnalyticsHeader;
