
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOffline();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-2">
        <WifiOff className="h-4 w-4 mr-2" />
        Working Offline
      </Badge>
    </div>
  );
};

export default OfflineIndicator;
