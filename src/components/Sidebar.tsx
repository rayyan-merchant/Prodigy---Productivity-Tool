
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, CheckSquare, BarChart2, Settings, Menu, Timer, FileText, Target, Flame, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", path: "/tasks" },
    { icon: Timer, label: "Pomodoro", path: "/pomodoro" },
    { icon: FileText, label: "Notes", path: "/notes" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: Flame, label: "Habits", path: "/habits" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <aside 
        className={cn(
          "bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50",
          // Mobile: fixed positioning with overlay behavior
          isMobile ? "fixed left-0 top-0" : "relative",
          // Width based on collapsed state
          collapsed ? (isMobile ? "-translate-x-full" : "w-16") : "w-64"
        )}
      >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed ? (
          <div className="h-8">
            <img src={prodigyLogo} alt="PRODIGY" className="h-full" />
          </div>
        ) : (
          <div className="h-8 mx-auto">
            <img src={prodigyLogo} alt="PRODIGY" className="h-full" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed ? "ml-auto" : "")}
        >
          {isMobile && !collapsed ? (
            <X size={20} className="text-gray-800 dark:text-gray-300" />
          ) : (
            <Menu size={20} className="text-gray-800 dark:text-gray-300" />
          )}
        </Button>
      </div>

      <nav className="p-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center justify-start",
                      collapsed ? "px-2" : "px-4",
                      "text-gray-800 dark:text-gray-300 hover:bg-[#D2353E]/10 hover:text-[#D2353E]",
                      isActive && "bg-[#D2353E]/10 text-[#D2353E]"
                    )}
                  >
                    <item.icon size={20} className={isActive ? "text-[#D2353E]" : "text-gray-600 dark:text-gray-400"} />
                    {!collapsed && (
                      <span className="ml-3 text-gray-800 dark:text-gray-300">{item.label}</span>
                    )}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
