
import React from 'react';
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  isWaitingForUser?: boolean;
  isBreak?: boolean;
  isLongBreak?: boolean;
}

const TimerControls: React.FC<TimerControlsProps> = ({ 
  isActive, 
  toggleTimer, 
  resetTimer,
  isWaitingForUser = false,
  isBreak = false,
  isLongBreak = false
}) => {
  const getButtonText = () => {
    if (isWaitingForUser) {
      if (isBreak) {
        return isLongBreak ? 'Start Long Break' : 'Start Short Break';
      } else {
        return 'Start Focus Session';
      }
    }
    
    if (isActive) {
      return 'Pause';
    }
    
    if (isBreak) {
      return isLongBreak ? 'Resume Long Break' : 'Resume Short Break';
    }
    
    return 'Start Focus';
  };

  return (
    <div className="flex gap-4">
      <Button 
        onClick={toggleTimer} 
        size="lg" 
        className={`px-8 py-6 text-lg ${
          !isActive ? 'bg-white text-gray-800 hover:bg-white/90' : 'bg-white/20 text-white hover:bg-white/30'
        } ${isWaitingForUser ? 'animate-pulse bg-green-500 hover:bg-green-600 text-white' : ''}`}
      >
        {getButtonText()}
      </Button>
      {(isActive || isWaitingForUser) && (
        <Button 
          onClick={resetTimer} 
          variant="outline" 
          size="lg" 
          className="px-6 py-6 text-lg text-white border-white/30 hover:bg-white/10"
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default TimerControls;
