
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/auth';
import { updateUserSettings } from '@/services/userService';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Handle dark mode toggle
  const handleThemeToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      const user = getCurrentUser();
      if (!user) return;
      
      await updateUserSettings(user.uid, { theme: newTheme });
      toast.success(`${newTheme === 'light' ? 'Light' : 'Dark'} mode activated`);
    } catch (error) {
      console.error("Error updating theme:", error);
      // Theme still changes locally even if the API call fails
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={18} className={`${theme === 'light' ? 'text-[#D2353E]' : 'text-muted-foreground'}`} />
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'} 
                onCheckedChange={handleThemeToggle}
              />
              <Moon size={18} className={`${theme === 'dark' ? 'text-[#D2353E]' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
