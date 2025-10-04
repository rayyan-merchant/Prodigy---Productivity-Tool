
import React, { useState, useEffect } from 'react';
import { Activity, FileText, CheckSquare, Target, Flame, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity as ActivityType } from '@/types/goals';
import { getRecentActivities } from '@/services/activityService';

const RecentActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const recentActivities = await getRecentActivities(5);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'goal':
        return <Target className="h-4 w-4" />;
      case 'habit':
        return <Flame className="h-4 w-4" />;
      case 'session':
        return <Clock className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'note':
        return 'bg-green-500 dark:bg-green-600';
      case 'goal':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'habit':
        return 'bg-orange-500 dark:bg-orange-600';
      case 'session':
        return 'bg-red-500 dark:bg-red-600';
      case 'settings':
        return 'bg-gray-500 dark:bg-gray-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getActivityColor(activity.type)} text-white flex-shrink-0`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs mt-1">Your activities will appear here as you use the app</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTimeline;
