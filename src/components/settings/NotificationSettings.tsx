
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Volume2, Clock, Target, Calendar } from 'lucide-react';
import { 
  getNotificationsEnabled, 
  setNotificationsEnabled, 
  requestNotificationPermission,
  sendMotivationalNotification
} from '@/services/notificationService';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabledState] = useState(getNotificationsEnabled());
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');

  useEffect(() => {
    setPermissionGranted(Notification.permission === 'granted');
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        return;
      }
      setPermissionGranted(true);
    }
    
    setNotificationsEnabled(enabled);
    setNotificationsEnabledState(enabled);
    
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleTestNotification = async () => {
    if (!notificationsEnabled) {
      toast.error('Please enable notifications first');
      return;
    }
    
    if (Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error('Please allow notifications in your browser');
        return;
      }
    }
    
    await sendMotivationalNotification();
    toast.success('Test notification sent!');
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    
    if (granted) {
      toast.success('Notification permission granted!');
    } else {
      toast.error('Notification permission denied. Please check your browser settings.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive productivity reminders and updates
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
              disabled={!permissionGranted}
            />
          </div>

          {/* Permission Status */}
          {!permissionGranted && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Notification permission is required to receive updates.
              </p>
              <Button onClick={handleRequestPermission} size="sm" variant="outline">
                Grant Permission
              </Button>
            </div>
          )}

          {/* Notification Types */}
          {notificationsEnabled && permissionGranted && (
            <div className="space-y-4">
              <h4 className="font-medium">You'll receive notifications for:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Volume2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Pomodoro Sessions</p>
                    <p className="text-xs text-muted-foreground">Start, end, and break reminders</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Target className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Goals & Habits</p>
                    <p className="text-xs text-muted-foreground">Progress updates and reminders</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Deadlines</p>
                    <p className="text-xs text-muted-foreground">Task due date reminders</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Wellness Reminders</p>
                    <p className="text-xs text-muted-foreground">Motivation and break reminders</p>
                  </div>
                </div>
              </div>

              {/* Test Notification */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Test Notifications</p>
                    <p className="text-xs text-muted-foreground">Send a test notification to verify settings</p>
                  </div>
                  <Button onClick={handleTestNotification} size="sm" variant="outline">
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Browser Notification Info */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <p className="font-medium mb-1">💡 Tip:</p>
            <p>
              Notifications will appear even when you're using other apps or browser tabs. 
              Make sure your browser allows notifications and your system's "Do Not Disturb" mode is off.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
