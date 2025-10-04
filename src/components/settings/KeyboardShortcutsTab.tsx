
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Keyboard, 
  Navigation, 
  CheckSquare, 
  FileText, 
  Timer, 
  Lightbulb,
  Download,
  Settings
} from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const KeyboardShortcutsTab: React.FC = () => {
  const { shortcuts } = useKeyboardShortcuts();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'All Shortcuts', icon: Keyboard },
    { key: 'Navigation', label: 'Navigation', icon: Navigation },
    { key: 'Tasks', label: 'Tasks', icon: CheckSquare },
    { key: 'Notes', label: 'Notes', icon: FileText },
    { key: 'Pomodoro', label: 'Pomodoro', icon: Timer },
    { key: 'General', label: 'General', icon: Settings }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || shortcut.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.key === category);
    return categoryData?.icon || Settings;
  };

  const formatShortcutKey = (key: string) => {
    return key.split('+').map(part => (
      <Badge key={part} variant="outline" className="mx-0.5 px-2 py-1 font-mono text-xs">
        {part}
      </Badge>
    ));
  };

  const exportShortcuts = () => {
    const shortcutList = shortcuts.map(s => `${s.key}: ${s.description}`).join('\n');
    const blob = new Blob([shortcutList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prodigy-keyboard-shortcuts.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Keyboard className="h-6 w-6" />
            Keyboard Shortcuts
          </h2>
          <p className="text-muted-foreground mt-1">
            Master these shortcuts to boost your productivity and work faster
          </p>
        </div>
        <Button variant="outline" onClick={exportShortcuts}>
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>
      </div>

      {/* Pro Tips Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                💡 Pro Tips for Power Users
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• All shortcuts use <Badge variant="outline" className="mx-1">Alt</Badge> as the modifier to avoid conflicts</li>
                <li>• Shortcuts work on any page unless you're typing in an input field</li>
                <li>• Press <Badge variant="outline" className="mx-1">Alt</Badge> + <Badge variant="outline" className="mx-1">H</Badge> anytime to see this help</li>
                <li>• Navigate quickly with <Badge variant="outline" className="mx-1">Alt</Badge> + <Badge variant="outline" className="mx-1">1-8</Badge> for different pages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories and Shortcuts */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-6 w-full">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.key} value={category.key} className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredShortcuts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Keyboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No shortcuts found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or browse different categories
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredShortcuts.map((shortcut, index) => {
                    const CategoryIcon = getCategoryIcon(shortcut.category);
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <CategoryIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">{shortcut.description}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {shortcut.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {formatShortcutKey(shortcut.key)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Reference Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
            <span>🚀</span>
            Quick Reference - Most Used
          </CardTitle>
          <CardDescription className="text-green-800 dark:text-green-200">
            The shortcuts you'll use most often
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Go to Tasks</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+2')}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Go to Pomodoro</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+3')}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Create Task</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+t')}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Start/Pause Timer</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+p')}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Create Note</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+n')}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Search</span>
                <div className="flex gap-1">{formatShortcutKey('Alt+/')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcutsTab;
