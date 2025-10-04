
import { useState, useEffect, useCallback } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useNotifications } from '@/hooks/useNotifications';

interface PomodoroResult {
  isActive: boolean;
  isBreak: boolean;
  isLongBreak: boolean;
  minutes: number;
  seconds: number;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  setIsBreak: (isBreak: boolean) => void;
  setIsLongBreak: (isLongBreak: boolean) => void;
  shouldPromptForNoteSave: boolean;
  setShouldPromptForNoteSave: (shouldPrompt: boolean) => void;
  sessionNotes: string;
  updateSessionNotes: (notes: string) => void;
  saveNotes: () => Promise<boolean>;
  pomodorosUntilLongBreak: number;
  isWaitingForUser: boolean;
}

export const usePomodoro = () => {
  const { settings, sessionsCompleted, incrementSessionsCompleted } = useTimer();
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [minutes, setMinutes] = useState(settings.workDuration);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shouldPromptForNoteSave, setShouldPromptForNoteSave] = useState(false);
  const [sessionNotes, setSessionNotes] = useState(() => {
    return localStorage.getItem('pomodoro-session-notes') || '';
  });
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(settings.longBreakInterval - (sessionsCompleted % settings.longBreakInterval));
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);

  // Import notification hook
  const { notifyPomodoroStart, notifyPomodoroEnd, notifyBreakStart, notifyBreakEnd } = useNotifications();

  const calculateProgress = useCallback(() => {
    const totalTime = (isBreak ? (isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration) : settings.workDuration) * 60;
    const timeLeft = (minutes * 60) + seconds;
    return 1 - (timeLeft / totalTime);
  }, [minutes, seconds, isBreak, isLongBreak, settings]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(isBreak ? (isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration) : settings.workDuration);
    setSeconds(0);
    setProgress(0);
  }, [isBreak, isLongBreak, settings]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [minutes, seconds, calculateProgress]);

  useEffect(() => {
    setMinutes(isBreak ? (isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration) : settings.workDuration);
    setPomodorosUntilLongBreak(settings.longBreakInterval - (sessionsCompleted % settings.longBreakInterval));
  }, [settings, isBreak, isLongBreak, sessionsCompleted]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      setIsActive(false);
    } else {
      if (isWaitingForUser) {
        // User is starting after a wait period
        setIsWaitingForUser(false);
        if (isBreak) {
          notifyBreakStart(isLongBreak);
        } else {
          notifyPomodoroStart();
        }
      } else {
        // Normal start
        if (isBreak) {
          notifyBreakStart(isLongBreak);
        } else {
          notifyPomodoroStart();
        }
      }
      setIsActive(true);
    }
  }, [isActive, isWaitingForUser, isBreak, isLongBreak, notifyPomodoroStart, notifyBreakStart]);

  useEffect(() => {
    localStorage.setItem('pomodoro-session-notes', sessionNotes);
  }, [sessionNotes]);

  const updateSessionNotes = (notes: string) => {
    setSessionNotes(notes);
  };

  const saveNotes = async (): Promise<boolean> => {
    try {
      localStorage.removeItem('pomodoro-session-notes');
      setSessionNotes('');
      return true;
    } catch (error) {
      console.error("Error saving notes:", error);
      return false;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isWaitingForUser) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          
          if (isBreak) {
            // Break ended
            notifyBreakEnd();
            setIsBreak(false);
            setIsLongBreak(false);
            
            // Check if we should prompt for note save
            if (sessionNotes.trim()) {
              setShouldPromptForNoteSave(true);
            }
          } else {
            // Focus session ended
            notifyPomodoroEnd();
            
            // Increment completed sessions
            incrementSessionsCompleted();
            const newSessionsCompleted = sessionsCompleted + 1;
            
            // Check if it's time for long break
            if (newSessionsCompleted % settings.longBreakInterval === 0) {
              setIsLongBreak(true);
            }
            
            setIsBreak(true);
            
            // Check if we should prompt for note save
            if (sessionNotes.trim()) {
              setShouldPromptForNoteSave(true);
            }
          }
          
          setIsWaitingForUser(true);
          resetTimer();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isActive, 
    minutes, 
    seconds, 
    isBreak, 
    isLongBreak, 
    sessionsCompleted, 
    settings.longBreakInterval, 
    sessionNotes, 
    isWaitingForUser,
    notifyPomodoroEnd,
    notifyBreakEnd,
    incrementSessionsCompleted,
    resetTimer
  ]);

  return {
    isActive,
    isBreak,
    isLongBreak,
    minutes,
    seconds,
    progress,
    toggleTimer,
    resetTimer,
    setIsBreak,
    setIsLongBreak,
    shouldPromptForNoteSave,
    setShouldPromptForNoteSave,
    sessionNotes,
    updateSessionNotes,
    saveNotes,
    pomodorosUntilLongBreak,
    isWaitingForUser
  };
};
