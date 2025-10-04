
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success('🌐 Back online! Syncing your data...', {
          duration: 3000,
        });
        // Trigger data sync
        const syncEvent = new CustomEvent('syncOfflineData');
        window.dispatchEvent(syncEvent);
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.warning('📱 You\'re offline. Don\'t worry, you can keep working!', {
        duration: 5000,
        description: 'Your changes will be saved locally and synced when you\'re back online.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Save data to localStorage when offline
  const saveOfflineData = (key: string, data: any) => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
      offlineData[key] = {
        data,
        timestamp: new Date().toISOString(),
        synced: false
      };
      localStorage.setItem('offlineData', JSON.stringify(offlineData));
      return true;
    } catch (error) {
      console.error('Error saving offline data:', error);
      return false;
    }
  };

  // Get offline data
  const getOfflineData = (key: string) => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
      return offlineData[key] || null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  // Clear synced offline data
  const clearSyncedData = () => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
      const unsyncedData = Object.entries(offlineData).reduce((acc: any, [key, value]: [string, any]) => {
        if (!value.synced) {
          acc[key] = value;
        }
        return acc;
      }, {});
      localStorage.setItem('offlineData', JSON.stringify(unsyncedData));
    } catch (error) {
      console.error('Error clearing synced data:', error);
    }
  };

  return {
    isOnline,
    wasOffline,
    saveOfflineData,
    getOfflineData,
    clearSyncedData
  };
};
