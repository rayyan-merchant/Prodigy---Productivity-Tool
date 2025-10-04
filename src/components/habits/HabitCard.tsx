
import React from 'react';
import { Edit, Trash2, CheckCircle, X, Calendar, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit } from '@/types/goals';
import { canCompleteHabitToday } from '@/services/habitService';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onMarkComplete: (habitId: string) => void;
  onMarkIncomplete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onEdit, 
  onDelete, 
  onMarkComplete, 
  onMarkIncomplete 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  const canComplete = canCompleteHabitToday(habit);
  
  const getStreakColor = (streak: number, target: number) => {
    const percentage = (streak / target) * 100;
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCategoryColor = (category: Habit['category']) => {
    const colors = {
      health: 'bg-green-500 dark:bg-green-600',
      productivity: 'bg-blue-500 dark:bg-blue-600',
      personal: 'bg-purple-500 dark:bg-purple-600',
      learning: 'bg-orange-500 dark:bg-orange-600',
      other: 'bg-gray-500 dark:bg-gray-600'
    };
    return colors[category];
  };

  const getTimeUntilNextDay = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntil = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground mb-2">
              {habit.name}
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary" className={`${getCategoryColor(habit.category)} text-white`}>
                {habit.category}
              </Badge>
              <Badge variant="outline">
                {habit.frequency}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(habit)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(habit.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {habit.description && (
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        )}
        
        {/* Streak Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className={`text-sm font-medium ${getStreakColor(habit.currentStreak, habit.targetStreak)}`}>
              {habit.currentStreak} day streak
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Best: {habit.longestStreak}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to target</span>
            <span>{habit.currentStreak}/{habit.targetStreak}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((habit.currentStreak / habit.targetStreak) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isCompletedToday && canComplete ? (
            <Button
              onClick={() => onMarkComplete(habit.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          ) : isCompletedToday ? (
            <div className="flex-1 space-y-2">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950"
                size="sm"
                disabled
              >
                <CheckCircle className="h-4 w-4 mr-1 fill-current" />
                Completed Today
              </Button>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Next check-in in {getTimeUntilNextDay()}</span>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              disabled
            >
              <X className="h-4 w-4 mr-1" />
              Already Completed
            </Button>
          )}
        </div>

        {/* Last completed */}
        {habit.completedDates.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Last completed: {new Date(habit.completedDates[habit.completedDates.length - 1]).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
