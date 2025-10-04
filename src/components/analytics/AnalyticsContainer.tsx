
import React, { useState, useEffect } from 'react';
import { getTasks } from '@/services/taskService';
import { getAllSessions, getSessionStats } from '@/services/sessionService';
import { toast } from 'sonner';

// Helper function to get date range based on days selection
const getDateRangeFromDays = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return { start, end };
};

type DateRangeType = '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
  tasks: any[];
  sessions: any[];
  completedTasks: number;
  focusHours: number;
  avgDailyFocus: number;
  sessionsCompleted: number;
  taskData: { date: string; tasks: number }[];
  focusData: { date: string; hours: number }[];
  projectTimeData: { name: string; value: number }[];
  thisWeekFocusTime: number;
  todayFocusTime: number;
  thisWeekCompletedTasks: number;
  todayCompletedTasks: number;
  totalCompletedTasks: number;
  totalFocusTime: number;
  hasData: boolean;
  isLoading: boolean;
  dateRange: { start: Date; end: Date };
  dateRangeType: DateRangeType;
}

interface AnalyticsContainerProps {
  children: (data: AnalyticsData & {
    handleDateRangeChange: (range: DateRangeType) => void;
  }) => React.ReactNode;
}

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ children }) => {
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('7d');
  const [dateRange, setDateRange] = useState(getDateRangeFromDays(7));
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);

  // Summary metrics
  const [completedTasks, setCompletedTasks] = useState(0);
  const [focusHours, setFocusHours] = useState(0);
  const [avgDailyFocus, setAvgDailyFocus] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Data for charts
  const [taskData, setTaskData] = useState<{ date: string; tasks: number }[]>([]);
  const [focusData, setFocusData] = useState<{ date: string; hours: number }[]>([]);
  const [projectTimeData, setProjectTimeData] = useState<{ name: string; value: number }[]>([]);
  
  // Summary stats
  const [thisWeekFocusTime, setThisWeekFocusTime] = useState(0);
  const [todayFocusTime, setTodayFocusTime] = useState(0);
  const [thisWeekCompletedTasks, setThisWeekCompletedTasks] = useState(0);
  const [todayCompletedTasks, setTodayCompletedTasks] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  // Process data for charts
  const processData = (tasks: any[], sessions: any[]) => {
    // Process task completion data by date
    const tasksByDate = new Map<string, number>();
    tasks.forEach(task => {
      if (task.status === 'completed' && task.completedAt) {
        const dateStr = new Date(task.completedAt).toLocaleDateString('en-US', { weekday: 'short' });
        tasksByDate.set(dateStr, (tasksByDate.get(dateStr) || 0) + 1);
      }
    });
    
    const taskChartData = Array.from(tasksByDate, ([date, tasks]) => ({ date, tasks }));
    setTaskData(taskChartData);
    
    // Process focus time data by date
    const focusByDate = new Map<string, number>();
    sessions.forEach(session => {
      if (session.date) {
        const sessionDate = typeof session.date === 'string' ? new Date(session.date) : session.date;
        const dateStr = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
        const hours = (session.duration || 0) / 60;
        focusByDate.set(dateStr, (focusByDate.get(dateStr) || 0) + hours);
      }
    });
    
    const focusChartData = Array.from(focusByDate, ([date, hours]) => ({ date, hours }));
    setFocusData(focusChartData);
    
    // Process project time distribution
    const projectTime = new Map<string, number>();
    sessions.forEach(session => {
      if (session.project) {
        const hours = (session.duration || 0) / 60;
        projectTime.set(session.project, (projectTime.get(session.project) || 0) + hours);
      }
    });
    
    const projectChartData = Array.from(projectTime, ([name, value]) => ({ name, value }));
    setProjectTimeData(projectChartData);
    
    // Calculate today's and this week's metrics
    const today = new Date().toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let todayTasks = 0;
    let weekTasks = 0;
    let todayTime = 0;
    let weekTime = 0;
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.completedAt) {
        const taskDate = new Date(task.completedAt);
        if (taskDate.toDateString() === today) {
          todayTasks++;
        }
        if (taskDate >= oneWeekAgo) {
          weekTasks++;
        }
      }
    });
    
    sessions.forEach(session => {
      if (session.date && session.type === 'focus' && session.completed) {
        const sessionDate = typeof session.date === 'string' ? new Date(session.date) : session.date;
        const hours = (session.duration || 0) / 60;
        
        if (sessionDate.toDateString() === today) {
          todayTime += hours;
        }
        if (sessionDate >= oneWeekAgo) {
          weekTime += hours;
        }
      }
    });
    
    setTodayCompletedTasks(todayTasks);
    setThisWeekCompletedTasks(weekTasks);
    setTodayFocusTime(Math.round(todayTime * 10) / 10);
    setThisWeekFocusTime(Math.round(weekTime * 10) / 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real tasks from Firebase
        const fetchedTasks = await getTasks() || [];
        
        // Filter tasks by date range
        const filteredTasks = fetchedTasks.filter((task: any) => {
          const taskDate = task.completedAt ? new Date(task.completedAt) : 
                          task.createdAt ? new Date(task.createdAt) : null;
          
          if (!taskDate) return false;
          return taskDate >= dateRange.start && taskDate <= dateRange.end;
        });
        
        setTasks(filteredTasks);
        
        // Fetch real sessions from Firebase
        const fetchedSessions = await getAllSessions();
        
        // Filter sessions by date range
        const filteredSessions = fetchedSessions.filter(session => {
          const sessionDate = typeof session.date === 'string' ? new Date(session.date) : session.date;
          return sessionDate >= dateRange.start && sessionDate <= dateRange.end;
        });
        
        setSessions(filteredSessions);
        
        // Calculate completed tasks
        const completed = filteredTasks.filter((task: any) => task.status === 'completed').length;
        setCompletedTasks(completed);
        setTotalCompletedTasks(completed);
        
        // Calculate focus time from real sessions
        const focusSessions = filteredSessions.filter(session => 
          session.type === 'focus' && session.completed
        );
        
        const totalFocusTime = focusSessions.reduce((total: number, session: any) => 
          total + (session.duration || 0), 0);
        const focusTimeHours = Math.round((totalFocusTime / 60) * 10) / 10;
        setFocusHours(focusTimeHours);
        setTotalFocusTime(focusTimeHours);
        
        const days = Math.max(1, Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 3600 * 24)));
        const avgDaily = Math.round((focusTimeHours / days) * 10) / 10;
        setAvgDailyFocus(avgDaily);
        
        setSessionsCompleted(focusSessions.length);
        
        processData(filteredTasks, filteredSessions);
        
        setHasData(filteredTasks.length > 0 || filteredSessions.length > 0);
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRangeType(range);
    
    if (range === '7d') {
      setDateRange(getDateRangeFromDays(7));
    } else if (range === '30d') {
      setDateRange(getDateRangeFromDays(30));
    } else if (range === '90d') {
      setDateRange(getDateRangeFromDays(90));
    } else {
      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 10);
      setDateRange({ start, end });
    }
  };

  return (
    <>
      {children({
        tasks,
        sessions,
        completedTasks,
        focusHours,
        avgDailyFocus,
        sessionsCompleted,
        taskData,
        focusData,
        projectTimeData,
        thisWeekFocusTime,
        todayFocusTime,
        thisWeekCompletedTasks,
        todayCompletedTasks,
        totalCompletedTasks,
        totalFocusTime,
        hasData,
        isLoading,
        dateRange,
        dateRangeType,
        handleDateRangeChange
      })}
    </>
  );
};

export default AnalyticsContainer;
