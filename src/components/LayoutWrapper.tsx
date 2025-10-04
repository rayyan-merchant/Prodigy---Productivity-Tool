
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';
import ProfileHeader from './ProfileHeader';
import { useTheme } from '@/hooks/useTheme';
import { useOffline } from '@/hooks/useOffline';

const LayoutWrapper: React.FC = () => {
  // Initialize theme
  const { theme } = useTheme();
  const { isOnline } = useOffline();
  
  // Need this to make the theme apply on initial load
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle offline data sync
  React.useEffect(() => {
    const handleSyncOfflineData = () => {
      // This event is triggered when coming back online
      console.log('Syncing offline data...');
      // Add actual sync logic here when needed
    };

    window.addEventListener('syncOfflineData', handleSyncOfflineData);
    return () => window.removeEventListener('syncOfflineData', handleSyncOfflineData);
  }, []);

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 flex justify-end">
        <ProfileHeader />
      </div>
      <div className="px-2 sm:px-4 md:px-6">
        <Outlet />
      </div>
    </Layout>
  );
};

export default LayoutWrapper;
