
import React, { useState, useEffect } from 'react';
import { Flame, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit } from '@/types/goals';
import { getHabits, updateHabit } from '@/services/habitService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HabitStreaks: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const fetchedHabits = await getHabits();
        // Show only the top 3 most active habits that haven't been completed today
        const today = new Date().toISOString().split('T')[0];
        const availableHabits = fetchedHabits
          .filter(h => h.isActive && !h.completedDates.includes(today))
          .slice(0, 3);
        setHabits(availableHabits);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const markHabitComplete = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit || habit.completedDates.includes(today)) return;
    
    try {
      const newStreak = habit.currentStreak + 1;
      const newLongestStreak = Math.max(habit.longestStreak, newStreak);
      const newCompletedDates = [...habit.completedDates, today];
      
      await updateHabit(habitId, {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        completedDates: newCompletedDates
      });
      
      // Remove the completed habit from the dashboard immediately
      setHabits(habits.filter(h => h.id !== habitId));
      
      toast.success(`Great job! ${newStreak} day streak! 🔥`);
    } catch (error) {
      console.error('Error marking habit complete:', error);
      toast.error('Failed to mark habit as complete');
    }
  };

  const getStreakColor = (streak: number, target: number) => {
    const percentage = (streak / target) * 100;
    if (percentage >= 100) return 'text-green-500 dark:text-green-400';
    if (percentage >= 70) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const handleNavigateToHabits = () => {
    navigate('/habits');
  };

  if (isLoading) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Flame className="h-5 w-5" />
            Habit Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Flame className="h-5 w-5" />
            Habit Streaks
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleNavigateToHabits}>
            <Plus className="h-4 w-4 mr-1" />
            New Habit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-sm text-foreground">{habit.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {habit.category}
                    </Badge>
                    <span className={`text-xs font-medium ${getStreakColor(habit.currentStreak, habit.targetStreak)}`}>
                      🔥 {habit.currentStreak} day streak
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
                  onClick={() => markHabitComplete(habit.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {habits.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Flame className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">All habits completed for today! 🎉</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleNavigateToHabits}>
                <Plus className="h-4 w-4 mr-1" />
                Manage habits
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitStreaks;
