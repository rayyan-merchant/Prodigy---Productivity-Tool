
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from '@/lib/auth';
import { getUserNotifications, markNotificationAsRead } from '@/services/notificationService';
import { Notification } from '../types/notifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = getCurrentUser();
        if (!user) return;

        const notificationData = await getUserNotifications();
        setNotifications(notificationData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Poll for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-[#D2353E]/10"
      >
        <Bell size={20} />
        {notifications.filter(n => !n.read).length > 0 && (
          <Badge 
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {notifications.filter(n => !n.read).length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-md shadow-lg z-50">
          <div className="p-3 border-b">
            <h3 className="font-medium">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-[#D2353E]/10 cursor-pointer ${
                    !notification.read ? "bg-accent/10" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
