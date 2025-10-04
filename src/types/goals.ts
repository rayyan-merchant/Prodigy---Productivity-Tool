
export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: 'health' | 'productivity' | 'personal' | 'learning' | 'other';
  frequency: 'daily' | 'weekly';
  targetStreak: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'task' | 'note' | 'goal' | 'habit' | 'session' | 'settings';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    [key: string]: any;
  };
}
