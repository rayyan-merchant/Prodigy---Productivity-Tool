
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useTimer } from '@/contexts/TimerContext';
import { usePomodoro } from '@/hooks/usePomodoro';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TimerSettings from '@/components/TimerSettings';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import type { Task } from '@/types/tasks';

// Import our components
import Background from '@/components/pomodoro/Background';
import HeaderBar from '@/components/pomodoro/HeaderBar';
import TimerCircle from '@/components/pomodoro/TimerCircle';
import TimerControls from '@/components/pomodoro/TimerControls';
import SessionInfo from '@/components/pomodoro/SessionInfo';
import SidebarOptions from '@/components/pomodoro/SidebarOptions';
import ActiveSessionInfo from '@/components/pomodoro/ActiveSessionInfo';
import SessionAnalytics from '@/components/pomodoro/SessionAnalytics';
import SoundThemes from '@/components/pomodoro/SoundThemes';
import TeamSessions from '@/components/pomodoro/TeamSessions';
import FocusMode from '@/components/pomodoro/FocusMode';
import TaskSelector from '@/components/pomodoro/TaskSelector';

const PomodoroTimer = () => {
  const { settings, sessionsCompleted } = useTimer();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSoundThemes, setShowSoundThemes] = useState(false);
  const [showTeamSessions, setShowTeamSessions] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [focusType, setFocusType] = useState(() => {
    return localStorage.getItem('pomodoro-focus-type') || 'General';
  });
  const [customFocus, setCustomFocus] = useState(() => {
    return localStorage.getItem('pomodoro-custom-focus') || '';
  });
  const [showCustomInput, setShowCustomInput] = useState(() => {
    return localStorage.getItem('pomodoro-focus-type') === 'Custom';
  });
  const [showNotes, setShowNotes] = useState(false);
  const { theme } = useTheme();
  const [noteSaveDialogOpen, setNoteSaveDialogOpen] = useState(false);
  
  const {
    isActive,
    isBreak,
    minutes,
    seconds,
    progress,
    toggleTimer,
    resetTimer,
    setIsBreak,
    isLongBreak,
    setIsLongBreak,
    shouldPromptForNoteSave,
    setShouldPromptForNoteSave,
    sessionNotes,
    updateSessionNotes,
    saveNotes,
    pomodorosUntilLongBreak,
    isWaitingForUser
  } = usePomodoro();

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleTogglePomodoro = () => {
      toggleTimer();
    };

    const handleResetPomodoro = () => {
      resetTimer();
    };

    window.addEventListener('togglePomodoro', handleTogglePomodoro);
    window.addEventListener('resetPomodoro', handleResetPomodoro);

    return () => {
      window.removeEventListener('togglePomodoro', handleTogglePomodoro);
      window.removeEventListener('resetPomodoro', handleResetPomodoro);
    };
  }, [toggleTimer, resetTimer]);

  // Show note save dialog when prompted
  useEffect(() => {
    if (shouldPromptForNoteSave && sessionNotes.trim()) {
      setNoteSaveDialogOpen(true);
    }
  }, [shouldPromptForNoteSave, sessionNotes]);

  // Save focus type and custom focus
  useEffect(() => {
    localStorage.setItem('pomodoro-focus-type', focusType);
    if (focusType === 'Custom' && customFocus) {
      localStorage.setItem('pomodoro-custom-focus', customFocus);
    }
  }, [focusType, customFocus]);

  const handleNoteNavigation = (noteType: string) => {
    if (noteType === 'Notebook') {
      navigate('/notes');
    } else {
      setShowNotes(true);
    }
  };

  const handleFocusTypeChange = (type: string) => {
    setFocusType(type);
    setShowCustomInput(type === 'Custom');
  };

  const handleBreakToggle = (breakType: 'focus' | 'short' | 'long') => {
    if (!isActive && !isWaitingForUser) {
      if (breakType === 'focus') {
        setIsBreak(false);
        setIsLongBreak(false);
      } else if (breakType === 'short') {
        setIsBreak(true);
        setIsLongBreak(false);
      } else if (breakType === 'long') {
        setIsBreak(true);
        setIsLongBreak(true);
      }
      resetTimer();
    }
  };

  const handleSaveNotes = async () => {
    const success = await saveNotes();
    if (success) {
      toast.success("Notes saved successfully");
      setNoteSaveDialogOpen(false);
      setShouldPromptForNoteSave(false);
    } else {
      toast.error("Failed to save notes");
    }
  };

  const handleDiscardNotes = () => {
    updateSessionNotes('');
    setNoteSaveDialogOpen(false);
    setShouldPromptForNoteSave(false);
  };
  
  const handleSaveSheetNotes = async () => {
    // Only try to save if there are notes to save
    if (sessionNotes.trim()) {
      const success = await saveNotes();
      if (success) {
        toast.success("Notes saved successfully");
      } else {
        toast.error("Failed to save notes");
      }
    }
    setShowNotes(false);
  };

  const handleTaskSelect = (task: Task | null) => {
    setSelectedTask(task);
    if (task) {
      // Update focus type to show task-based focus
      setFocusType('Task');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Overlay */}
      <Background />
      
      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col p-6">
        {/* Top Navigation */}
        <HeaderBar />
        
        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center mx-auto w-full max-w-7xl">
          {/* Timer Section - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Toggle Focus/Break Button */}
            <div className="mb-8">
              <div className="flex space-x-2 p-2 bg-white/10 backdrop-blur-sm rounded-full">
                <button
                  onClick={() => handleBreakToggle('focus')}
                  className={`py-2 px-4 rounded-full transition ${!isBreak ? 'bg-white/80 text-gray-900' : 'text-white/80'}`}
                  disabled={isActive || isWaitingForUser}
                >
                  Focus
                </button>
                <button
                  onClick={() => handleBreakToggle('short')}
                  className={`py-2 px-4 rounded-full transition ${isBreak && !isLongBreak ? 'bg-white/80 text-gray-900' : 'text-white/80'}`}
                  disabled={isActive || isWaitingForUser}
                >
                  Short Break ({settings.shortBreakDuration} min)
                </button>
                <button
                  onClick={() => handleBreakToggle('long')}
                  className={`py-2 px-4 rounded-full transition ${isBreak && isLongBreak ? 'bg-white/80 text-gray-900' : 'text-white/80'}`}
                  disabled={isActive || isWaitingForUser}
                >
                  Long Break ({settings.longBreakDuration} min)
                </button>
              </div>
            </div>

            {/* Task Selection - Only show during focus mode */}
            {!isBreak && (
              <div className="mb-6 w-full max-w-md">
                <TaskSelector 
                  selectedTask={selectedTask}
                  onTaskSelect={handleTaskSelect}
                />
              </div>
            )}
            
            {/* Timer Circle */}
            <TimerCircle minutes={minutes} seconds={seconds} progress={progress} />
            
            {/* Session Label */}
            <SessionInfo 
              isBreak={isBreak} 
              isLongBreak={isLongBreak}
              sessionsCompleted={sessionsCompleted} 
              longBreakInterval={settings.longBreakInterval}
            />
            
            {/* Pomodoros until long break */}
            {!isBreak && !isLongBreak && (
              <div className="mt-2 text-white/70 text-sm">
                {pomodorosUntilLongBreak === 1 
                  ? "1 more session until long break" 
                  : `${pomodorosUntilLongBreak} more sessions until long break`}
              </div>
            )}

            {/* Waiting state indicator */}
            {isWaitingForUser && (
              <div className="mt-4 text-center">
                <div className="text-white/90 text-lg font-medium mb-2">
                  {isBreak 
                    ? (isLongBreak ? 'Long break ready!' : 'Short break ready!') 
                    : 'Ready for next focus session!'}
                </div>
                <div className="text-white/70 text-sm">
                  Click the button below when you're ready to continue
                </div>
              </div>
            )}

            {/* Timer Controls */}
            <TimerControls 
              isActive={isActive} 
              toggleTimer={toggleTimer} 
              resetTimer={resetTimer}
              isWaitingForUser={isWaitingForUser}
              isBreak={isBreak}
              isLongBreak={isLongBreak}
            />

            {/* Mobile Controls for Notes - Only visible on small screens */}
            <div className="mt-8 md:hidden">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowNotes(true)}
              >
                {sessionNotes.trim() ? "View/Edit Notes" : "Add Session Notes"}
              </Button>
            </div>
          </div>
          
          {/* Right Sidebar - Only visible on larger screens */}
          <div className="hidden md:block">
            <div className="space-y-4 ml-8">
              <SidebarOptions 
                onNoteNavigation={handleNoteNavigation}
                onFocusTypeChange={handleFocusTypeChange}
                onSettingsOpen={() => setShowSettings(true)}
                customFocus={customFocus}
                setCustomFocus={setCustomFocus}
                showCustomInput={showCustomInput}
                onAnalyticsOpen={() => setShowAnalytics(true)}
                onSoundThemesOpen={() => setShowSoundThemes(true)}
                onTeamSessionsOpen={() => setShowTeamSessions(true)}
                onFocusModeOpen={() => setShowFocusMode(true)}
              />
              
              {/* When Timer is Active, Show Task and Notes Panels */}
              {isActive && (
                <ActiveSessionInfo 
                  focusType={selectedTask ? 'Task' : focusType}
                  customFocus={selectedTask ? selectedTask.title : customFocus}
                  quickNote={sessionNotes}
                  setQuickNote={updateSessionNotes}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className={`${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
          </DialogHeader>
          <TimerSettings onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Notes Sheet */}
      <Sheet open={showNotes} onOpenChange={setShowNotes}>
        <SheetContent className={`w-[400px] sm:w-[540px] ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
          <SheetHeader>
            <SheetTitle className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Focus Notes</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Textarea 
              className={`min-h-[300px] ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-500'}`}
              placeholder="Write your notes here..."
              value={sessionNotes}
              onChange={(e) => updateSessionNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveSheetNotes}>Save Notes</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Note Save Dialog */}
      <Dialog open={noteSaveDialogOpen} onOpenChange={setNoteSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Session Notes</DialogTitle>
            <DialogDescription>
              Would you like to save your notes from this focus session?
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[200px] overflow-y-auto border rounded-md p-3 my-4 bg-muted/50">
            {sessionNotes}
          </div>
          
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button variant="outline" onClick={handleDiscardNotes}>
              Discard
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Feature Dialogs */}
      <SessionAnalytics 
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
      
      <SoundThemes 
        isOpen={showSoundThemes}
        onClose={() => setShowSoundThemes(false)}
      />
      
      <TeamSessions 
        isOpen={showTeamSessions}
        onClose={() => setShowTeamSessions(false)}
      />
      
      <FocusMode 
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />
    </div>
  );
};

export default PomodoroTimer;
