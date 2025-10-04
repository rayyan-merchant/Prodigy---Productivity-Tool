
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Sidebar from './Sidebar';
import OfflineIndicator from './OfflineIndicator';
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OfflineIndicator />
      <Sidebar collapsed={collapsed || isMobile} setCollapsed={setCollapsed} />
      <main className={cn(
        "flex-1 transition-all duration-300 overflow-auto",
        // On mobile, sidebar is overlay so no margin needed
        // On desktop, adjust margin based on collapsed state
        isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"
      )}>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
