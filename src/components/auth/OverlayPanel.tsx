
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OverlayPanelProps {
  isLogin: boolean;
  toggleAuthMode: () => void;
}

const OverlayPanel: React.FC<OverlayPanelProps> = ({ isLogin, toggleAuthMode }) => {
  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-1/2 bg-[#FFA5A5] transition-transform duration-500 ease-in-out flex items-center justify-center text-white",
      isLogin ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="text-center p-12 max-w-md">
        {isLogin ? (
          <>
            <h2 className="text-3xl font-bold mb-4">HELLO BUDDY!</h2>
            <p className="mb-8">Enter your personal details and start your journey with us</p>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 rounded-full"
              onClick={toggleAuthMode}
            >
              SIGN UP
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">WELCOME BACK!</h2>
            <p className="mb-8">To keep connected with us please login with your personal info</p>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 rounded-full"
              onClick={toggleAuthMode}
            >
              SIGN IN
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OverlayPanel;
