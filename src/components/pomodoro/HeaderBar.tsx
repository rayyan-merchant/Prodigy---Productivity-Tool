
import React from 'react';
import { Timer, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from '@/hooks/useTheme';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Tasks", path: "/tasks" },
    { label: "Pomodoro", path: "/pomodoro" },
    { label: "Notes", path: "/notes" },
    { label: "Goals", path: "/goals" },
    { label: "Habits", path: "/habits" },
    { label: "Analytics", path: "/analytics" },
    { label: "Settings", path: "/settings" }
  ];

  return (
    <div className="flex justify-between items-center mb-12 px-6">
      <div className="flex-1 flex justify-start">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={`${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
            <SheetHeader>
              <div className="flex items-center">
                <div className="h-8 mr-2">
                  <img src={prodigyLogo} alt="PRODIGY" className="h-full" />
                </div>
                <SheetTitle className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                  Navigation
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start hover:bg-[#D2353E]/10 hover:text-[#D2353E]"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white flex-1 text-center flex items-center justify-center">
        <Timer className="inline mr-2 h-6 w-6" />
        TIMER
      </h1>
      <div className="flex-1"></div>
    </div>
  );
};

export default HeaderBar;
