
import React from 'react';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import SummaryCards from '@/components/analytics/SummaryCards';
import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';
import FocusTimeChart from '@/components/analytics/FocusTimeChart';
import ProductivityInsights from '@/components/analytics/ProductivityInsights';
import ProjectTimeDistribution from '@/components/analytics/ProjectTimeDistribution';
import WeeklyAiInsights from '@/components/analytics/WeeklyAiInsights';
import NoDataPlaceholder from '@/components/analytics/NoDataPlaceholder';
import AnalyticsContainer from '@/components/analytics/AnalyticsContainer';

const Analytics = () => {
  return (
    <div className="p-6 space-y-6 fade-in">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <AnalyticsContainer>
        {({
          isLoading,
          hasData,
          dateRangeType,
          handleDateRangeChange,
          totalFocusTime,
          thisWeekFocusTime,
          todayFocusTime,
          totalCompletedTasks,
          thisWeekCompletedTasks,
          todayCompletedTasks,
          taskData,
          focusData,
          projectTimeData,
          completedTasks,
          focusHours,
          sessionsCompleted,
          sessions,
          tasks
        }) => (
          <>
            <div className="flex justify-end">
              <DateRangeSelector dateRange={dateRangeType} setDateRange={handleDateRangeChange} />
            </div>
            
            {isLoading ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              </div>
            ) : hasData ? (
              <>
                <SummaryCards 
                  isLoading={false}
                  totalFocusTime={totalFocusTime}
                  thisWeekFocusTime={thisWeekFocusTime}
                  todayFocusTime={todayFocusTime}
                  totalCompletedTasks={totalCompletedTasks}
                  thisWeekCompletedTasks={thisWeekCompletedTasks}
                  todayCompletedTasks={todayCompletedTasks}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TaskCompletionChart 
                    isLoading={false} 
                    taskData={taskData} 
                    totalCompletedTasks={totalCompletedTasks} 
                  />
                  <FocusTimeChart 
                    isLoading={false} 
                    focusData={focusData} 
                    totalFocusTime={totalFocusTime} 
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <ProjectTimeDistribution 
                    isLoading={false} 
                    projectTimeData={projectTimeData} 
                  />
                  <WeeklyAiInsights 
                    completedTasks={completedTasks}
                    focusHours={focusHours}
                    sessionsCompleted={sessionsCompleted}
                  />
                </div>
                
                <ProductivityInsights 
                  isLoading={false}
                  filteredSessions={sessions}
                  filteredTasks={tasks}
                  totalCompletedTasks={totalCompletedTasks}
                  totalFocusTime={totalFocusTime}
                  dateRange={dateRangeType}
                  focusData={focusData}
                />
              </>
            ) : (
              <NoDataPlaceholder />
            )}
          </>
        )}
      </AnalyticsContainer>
    </div>
  );
};

export default Analytics;
