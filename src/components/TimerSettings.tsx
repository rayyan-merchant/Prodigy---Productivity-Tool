
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTimer } from '@/contexts/TimerContext';
import { toast } from 'sonner';

interface TimerSettingsProps {
  onClose: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useTimer();
  
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSettings({
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval
      });
      
      toast.success('Settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="work-duration">Focus Duration: {workDuration} minutes</Label>
            <span className="text-sm text-muted-foreground">{workDuration} min</span>
          </div>
          <Slider
            id="work-duration"
            min={5}
            max={60}
            step={5}
            value={[workDuration]}
            onValueChange={(value) => setWorkDuration(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="short-break">Short Break: {shortBreakDuration} minutes</Label>
            <span className="text-sm text-muted-foreground">{shortBreakDuration} min</span>
          </div>
          <Slider
            id="short-break"
            min={1}
            max={15}
            step={1}
            value={[shortBreakDuration]}
            onValueChange={(value) => setShortBreakDuration(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="long-break">Long Break: {longBreakDuration} minutes</Label>
            <span className="text-sm text-muted-foreground">{longBreakDuration} min</span>
          </div>
          <Slider
            id="long-break"
            min={10}
            max={30}
            step={5}
            value={[longBreakDuration]}
            onValueChange={(value) => setLongBreakDuration(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="long-break-interval">Long Break After: {longBreakInterval} sessions</Label>
            <span className="text-sm text-muted-foreground">{longBreakInterval} sessions</span>
          </div>
          <Slider
            id="long-break-interval"
            min={2}
            max={6}
            step={1}
            value={[longBreakInterval]}
            onValueChange={(value) => setLongBreakInterval(value[0])}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default TimerSettings;
