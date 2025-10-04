
import React from 'react';

interface SessionInfoProps {
  isBreak: boolean;
  isLongBreak?: boolean;
  sessionsCompleted: number;
  longBreakInterval: number;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ 
  isBreak, 
  isLongBreak,
  sessionsCompleted, 
  longBreakInterval 
}) => {
  return (
    <>
      <div className="text-xl font-medium text-white/80 mb-6">
        {isBreak 
          ? (isLongBreak ? 'Long Break' : 'Short Break') 
          : 'Focus Time'}
      </div>
      
      {sessionsCompleted > 0 && (
        <div className="mt-6 text-sm text-white/60">
          Sessions completed today: {sessionsCompleted}
        </div>
      )}
    </>
  );
};

export default SessionInfo;
