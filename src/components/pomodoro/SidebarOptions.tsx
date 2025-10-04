
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  StickyNote, 
  Settings, 
  BarChart3, 
  Volume2,
  Users,
  Shield,
  Target,
  Flame
} from "lucide-react";

interface SidebarOptionsProps {
  onNoteNavigation: (noteType: string) => void;
  onFocusTypeChange: (type: string) => void;
  onSettingsOpen: () => void;
  customFocus: string;
  setCustomFocus: (focus: string) => void;
  showCustomInput: boolean;
  onAnalyticsOpen?: () => void;
  onSoundThemesOpen?: () => void;
  onTeamSessionsOpen?: () => void;
  onFocusModeOpen?: () => void;
}

const SidebarOptions: React.FC<SidebarOptionsProps> = ({
  onNoteNavigation,
  onFocusTypeChange,
  onSettingsOpen,
  customFocus,
  setCustomFocus,
  showCustomInput,
  onAnalyticsOpen,
  onSoundThemesOpen,
  onTeamSessionsOpen,
  onFocusModeOpen
}) => {
  const focusOptions = ['General', 'Work', 'Study', 'Creative', 'Custom'];

  return (
    <div className="space-y-4">
      {/* Enhanced Focus Options */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Focus Type</h3>
          <div className="space-y-2">
            {focusOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFocusTypeChange(option)}
                className="w-full text-left p-2 rounded hover:bg-white/10 transition text-sm"
              >
                {option}
              </button>
            ))}
            {showCustomInput && (
              <Input
                placeholder="Enter custom focus..."
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => onNoteNavigation('Notebook')}
            >
              <BookOpen size={16} className="mr-2" />
              Open Notebook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => onNoteNavigation('Quick Note')}
            >
              <StickyNote size={16} className="mr-2" />
              Quick Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Habits */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Goals & Habits</h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => window.location.href = '/goals'}
            >
              <Target size={16} className="mr-2" />
              View Goals
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => window.location.href = '/habits'}
            >
              <Flame size={16} className="mr-2" />
              Track Habits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Enhanced Features</h3>
          <div className="space-y-2">
            {onAnalyticsOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={onAnalyticsOpen}
              >
                <BarChart3 size={16} className="mr-2" />
                Session Analytics
              </Button>
            )}
            {onSoundThemesOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={onSoundThemesOpen}
              >
                <Volume2 size={16} className="mr-2" />
                Sound Themes
              </Button>
            )}
            {onTeamSessionsOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={onTeamSessionsOpen}
              >
                <Users size={16} className="mr-2" />
                Team Sessions
              </Button>
            )}
            {onFocusModeOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={onFocusModeOpen}
              >
                <Shield size={16} className="mr-2" />
                Focus Mode
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={onSettingsOpen}
          >
            <Settings size={16} className="mr-2" />
            Timer Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarOptions;
