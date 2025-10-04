
import React from 'react';

interface TimerCircleProps {
  minutes: number;
  seconds: number;
  progress: number;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ minutes, seconds, progress }) => {
  return (
    <div className="relative h-80 w-80 rounded-full border-8 border-white/20 flex items-center justify-center mb-8">
      <svg className="absolute inset-0 h-full w-full -rotate-90">
        <circle 
          cx="50%" 
          cy="50%" 
          r="46%" 
          strokeWidth="4%"
          stroke="white" 
          strokeDasharray="100" 
          strokeDashoffset={100 - progress} 
          fill="none"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="text-6xl font-bold text-white">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default TimerCircle;
