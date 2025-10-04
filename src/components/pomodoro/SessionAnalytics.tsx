
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Clock, Target } from 'lucide-react';
import { getAllSessions, getSessionStats, PomodoroSession } from '@/services/sessionService';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

interface SessionAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    totalInterruptions: 0,
    averageSessionLength: 0
  });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Load all sessions and stats
      const [allSessions, sessionStats] = await Promise.all([
        getAllSessions(),
        getSessionStats()
      ]);
      
      setSessions(allSessions);
      setStats(sessionStats);
      
      // Process weekly data
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weeklySessionData = weekDays.map(day => {
        const dayString = format(day, 'yyyy-MM-dd');
        const daySessions = allSessions.filter(session => {
          const sessionDate = typeof session.date === 'string' 
            ? session.date 
            : format(session.date, 'yyyy-MM-dd');
          return sessionDate === dayString && session.type === 'focus' && session.completed;
        });
        
        return {
          day: format(day, 'EEE'),
          sessions: daySessions.length,
          focusTime: daySessions.reduce((total, session) => total + session.duration, 0),
          interruptions: daySessions.reduce((total, session) => total + (session.interruptions || 0), 0)
        };
      });
      
      setWeeklyData(weeklySessionData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Session Analytics</h2>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(stats.totalFocusTime / 60)}h</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(stats.averageSessionLength)}min</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interruptions</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInterruptions}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Sessions Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>This Week's Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Focus Time Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Focus Time (Minutes)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="focusTime" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionAnalytics;
