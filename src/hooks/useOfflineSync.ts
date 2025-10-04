import { useState, useEffect, useCallback } from 'react';
import { useOffline } from './useOffline';
import { toast } from 'sonner';

interface OfflineSyncItem {
  id: string;
  type: 'task' | 'note' | 'goal' | 'habit';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export const useOfflineSync = () => {
  const { isOnline, saveOfflineData, getOfflineData, clearSyncedData } = useOffline();
  const [pendingSync, setPendingSync] = useState<OfflineSyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load pending sync items on mount
  useEffect(() => {
    const loadPendingItems = () => {
      const offlineData = localStorage.getItem('offlineData');
      if (offlineData) {
        try {
          const data = JSON.parse(offlineData);
          const pending = Object.values(data).filter((item: any) => !item.synced);
          setPendingSync(pending as OfflineSyncItem[]);
        } catch (error) {
          console.error('Error loading pending sync items:', error);
        }
      }
    };

    loadPendingItems();
  }, []);

  // Queue an action for offline sync
  const queueOfflineAction = useCallback((item: Omit<OfflineSyncItem, 'timestamp'>) => {
    const syncItem: OfflineSyncItem = {
      ...item,
      timestamp: new Date().toISOString()
    };

    saveOfflineData(syncItem.id, syncItem);
    setPendingSync(prev => [...prev, syncItem]);
  }, [saveOfflineData]);

  // Sync pending items when online
  const syncPendingItems = useCallback(async () => {
    if (!isOnline || isSyncing || pendingSync.length === 0) return;

    setIsSyncing(true);
    let successCount = 0;

    try {
      for (const item of pendingSync) {
        try {
          // Here you would implement actual sync logic for each item type
          // For now, we'll just simulate success
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Mark as synced in localStorage
          const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
          if (offlineData[item.id]) {
            offlineData[item.id].synced = true;
            localStorage.setItem('offlineData', JSON.stringify(offlineData));
          }
          
          successCount++;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Synced ${successCount} items successfully`);
        clearSyncedData();
        setPendingSync(prev => prev.filter(item => {
          const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
          return !offlineData[item.id]?.synced;
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync offline changes');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, pendingSync, clearSyncedData]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      const timer = setTimeout(syncPendingItems, 1000); // Delay to ensure connection is stable
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSync.length, syncPendingItems]);

  return {
    pendingSync,
    isSyncing,
    queueOfflineAction,
    syncPendingItems
  };
};