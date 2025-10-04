
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Globe, Smartphone, Zap, Plus, X, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BlockedSite {
  id: string;
  url: string;
  category: string;
}

interface FocusSession {
  id: string;
  name: string;
  isActive: boolean;
  startTime: Date;
  duration: number; // in minutes
  blockedSites: string[];
  allowedBreaks: number;
  breaksUsed: number;
}

const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('Stay focused! You blocked this site during your focus session.');
  const [activeSessions, setActiveSessions] = useState<FocusSession[]>([]);
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const { toast } = useToast();

  // Default blocked sites
  const defaultBlockedSites: BlockedSite[] = [
    { id: '1', url: 'facebook.com', category: 'Social Media' },
    { id: '2', url: 'twitter.com', category: 'Social Media' },
    { id: '3', url: 'instagram.com', category: 'Social Media' },
    { id: '4', url: 'youtube.com', category: 'Entertainment' },
    { id: '5', url: 'reddit.com', category: 'Social Media' },
    { id: '6', url: 'tiktok.com', category: 'Entertainment' },
    { id: '7', url: 'netflix.com', category: 'Entertainment' },
    { id: '8', url: 'twitch.tv', category: 'Entertainment' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Load saved settings or use defaults
      const savedSites = localStorage.getItem('focus-mode-blocked-sites');
      if (savedSites) {
        setBlockedSites(JSON.parse(savedSites));
      } else {
        setBlockedSites(defaultBlockedSites);
      }

      const savedSettings = localStorage.getItem('focus-mode-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsEnabled(settings.isEnabled || false);
        setCustomMessage(settings.customMessage || customMessage);
        setAllowNotifications(settings.allowNotifications || false);
        setStrictMode(settings.strictMode || false);
      }

      // Mock active session
      const mockSession: FocusSession = {
        id: '1',
        name: 'Deep Work Session',
        isActive: true,
        startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
        duration: 60,
        blockedSites: ['facebook.com', 'twitter.com', 'youtube.com'],
        allowedBreaks: 2,
        breaksUsed: 0
      };
      setActiveSessions([mockSession]);
    }
  }, [isOpen]);

  const saveSettings = () => {
    const settings = {
      isEnabled,
      customMessage,
      allowNotifications,
      strictMode
    };
    localStorage.setItem('focus-mode-settings', JSON.stringify(settings));
    localStorage.setItem('focus-mode-blocked-sites', JSON.stringify(blockedSites));
  };

  const addBlockedSite = () => {
    if (!newSiteUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive"
      });
      return;
    }

    // Clean up URL
    let cleanUrl = newSiteUrl.trim().toLowerCase();
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');

    if (blockedSites.some(site => site.url === cleanUrl)) {
      toast({
        title: "Error",
        description: "This website is already blocked",
        variant: "destructive"
      });
      return;
    }

    const newSite: BlockedSite = {
      id: Date.now().toString(),
      url: cleanUrl,
      category: 'Custom'
    };

    setBlockedSites([...blockedSites, newSite]);
    setNewSiteUrl('');
    
    toast({
      title: "Website Added",
      description: `${cleanUrl} has been added to your blocked list`
    });
  };

  const removeBlockedSite = (id: string) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
    toast({
      title: "Website Removed",
      description: "Website has been removed from your blocked list"
    });
  };

  const toggleFocusMode = () => {
    setIsEnabled(!isEnabled);
    saveSettings();
    
    toast({
      title: isEnabled ? "Focus Mode Disabled" : "Focus Mode Enabled",
      description: isEnabled 
        ? "Website blocking has been disabled" 
        : "Website blocking is now active"
    });
  };

  const startFocusSession = () => {
    toast({
      title: "Focus Session Started",
      description: "Website blocking is now active for your focus session"
    });
  };

  const endFocusSession = (sessionId: string) => {
    setActiveSessions(activeSessions.filter(session => session.id !== sessionId));
    toast({
      title: "Focus Session Ended",
      description: "Website blocking has been disabled"
    });
  };

  const takeBreak = (sessionId: string) => {
    const updatedSessions = activeSessions.map(session => {
      if (session.id === sessionId && session.breaksUsed < session.allowedBreaks) {
        return { ...session, breaksUsed: session.breaksUsed + 1 };
      }
      return session;
    });
    setActiveSessions(updatedSessions);
    
    toast({
      title: "Break Started",
      description: "You have 5 minutes before focus mode re-activates"
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getSessionProgress = (session: FocusSession) => {
    const elapsed = Date.now() - session.startTime.getTime();
    const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
    const progress = Math.min((elapsedMinutes / session.duration) * 100, 100);
    return { elapsedMinutes, progress };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Focus Mode</h2>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Focus Mode Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Focus Mode Status
                    </span>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={toggleFocusMode}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {isEnabled 
                      ? "Focus mode is active. Distracting websites are blocked."
                      : "Focus mode is disabled. All websites are accessible."
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Blocked Websites */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Blocked Websites
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter website URL (e.g., facebook.com)"
                      value={newSiteUrl}
                      onChange={(e) => setNewSiteUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBlockedSite()}
                    />
                    <Button onClick={addBlockedSite} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {blockedSites.map((site) => (
                      <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{site.url}</p>
                            <p className="text-sm text-muted-foreground">{site.category}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBlockedSite(site.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications during focus sessions
                      </p>
                    </div>
                    <Switch
                      checked={allowNotifications}
                      onCheckedChange={setAllowNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Strict Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Prevent disabling focus mode during sessions
                      </p>
                    </div>
                    <Switch
                      checked={strictMode}
                      onCheckedChange={setStrictMode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Custom Block Message</label>
                    <Textarea
                      placeholder="Message shown when accessing blocked sites"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <Button onClick={saveSettings} className="w-full">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Active Sessions */}
            <div className="space-y-6">
              {/* Quick Start */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Quick Focus Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Start a focused work session with website blocking
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={startFocusSession} className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        25 min
                      </Button>
                      <Button onClick={startFocusSession} variant="outline" className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        50 min
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Focus Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No active focus sessions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSessions.map((session) => {
                        const { elapsedMinutes, progress } = getSessionProgress(session);
                        return (
                          <div key={session.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{session.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {elapsedMinutes} / {session.duration} minutes
                                </p>
                              </div>
                              <Badge variant="default">Active</Badge>
                            </div>
                            
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{session.blockedSites.length} sites blocked</span>
                              </div>
                              <span>
                                Breaks: {session.breaksUsed}/{session.allowedBreaks}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => takeBreak(session.id)}
                                disabled={session.breaksUsed >= session.allowedBreaks}
                                className="flex-1"
                              >
                                Take Break
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => endFocusSession(session.id)}
                                className="flex-1"
                              >
                                End Session
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Focus Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Sessions Today</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">6.5h</div>
                      <div className="text-sm text-muted-foreground">Focus Time</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">89%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">47</div>
                      <div className="text-sm text-muted-foreground">Sites Blocked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
