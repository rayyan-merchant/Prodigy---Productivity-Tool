
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface SoundThemesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SoundThemes: React.FC<SoundThemesProps> = ({ isOpen, onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [volume, setVolume] = useState([50]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const soundThemes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Simple notification sounds',
      focusSound: '/sounds/focus-start.mp3',
      breakSound: '/sounds/break-start.mp3'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Birds chirping and water sounds',
      focusSound: '/sounds/nature-focus.mp3',
      breakSound: '/sounds/nature-break.mp3'
    },
    {
      id: 'chimes',
      name: 'Chimes',
      description: 'Peaceful wind chimes',
      focusSound: '/sounds/chimes-focus.mp3',
      breakSound: '/sounds/chimes-break.mp3'
    },
    {
      id: 'digital',
      name: 'Digital',
      description: 'Modern electronic sounds',
      focusSound: '/sounds/digital-focus.mp3',
      breakSound: '/sounds/digital-break.mp3'
    }
  ];

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('pomodoro-sound-theme') || 'default';
    const savedVolume = localStorage.getItem('pomodoro-sound-volume');
    const savedEnabled = localStorage.getItem('pomodoro-sound-enabled') !== 'false';
    
    setSelectedTheme(savedTheme);
    setVolume(savedVolume ? [parseInt(savedVolume)] : [50]);
    setSoundEnabled(savedEnabled);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('pomodoro-sound-theme', themeId);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    localStorage.setItem('pomodoro-sound-volume', newVolume[0].toString());
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    localStorage.setItem('pomodoro-sound-enabled', newEnabled.toString());
  };

  const playPreview = (soundPath: string) => {
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio(soundPath);
      audio.volume = volume[0] / 100;
      audio.play().catch(error => {
        console.log('Audio preview not available:', error);
      });
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const handleSave = () => {
    // Save all preferences
    localStorage.setItem('pomodoro-sound-theme', selectedTheme);
    localStorage.setItem('pomodoro-sound-volume', volume[0].toString());
    localStorage.setItem('pomodoro-sound-enabled', soundEnabled.toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sound Themes</h2>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          {/* Sound Enable/Disable */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                Sound Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled">Enable Notifications</Label>
                <Button
                  variant={soundEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSound}
                >
                  {soundEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              {soundEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume: {volume[0]}%</Label>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={5}
                    value={volume}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Choose Sound Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
                <div className="space-y-4">
                  {soundThemes.map((theme) => (
                    <div key={theme.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={theme.id} id={theme.id} />
                      <div className="flex-1">
                        <Label htmlFor={theme.id} className="font-medium cursor-pointer">
                          {theme.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playPreview(theme.focusSound)}
                          disabled={!soundEnabled}
                        >
                          Focus
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playPreview(theme.breakSound)}
                          disabled={!soundEnabled}
                        >
                          Break
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundThemes;
