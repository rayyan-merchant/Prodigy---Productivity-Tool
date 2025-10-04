
import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, Calendar, TrendingUp, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Goal } from '@/types/goals';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, newValue: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateValue, setUpdateValue] = useState(goal.currentValue);

  const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isCompleted = goal.currentValue >= goal.targetValue;
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      personal: 'bg-blue-500',
      work: 'bg-purple-500',
      health: 'bg-green-500',
      learning: 'bg-orange-500',
      other: 'bg-gray-500'
    };
    return colors[category];
  };

  const handleQuickUpdate = (increment: number) => {
    const newValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + increment));
    onUpdateProgress(goal.id, newValue);
  };

  const handleManualUpdate = () => {
    const newValue = Math.max(0, Math.min(goal.targetValue, updateValue));
    onUpdateProgress(goal.id, newValue);
    setIsUpdating(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {goal.title}
            </CardTitle>
            <Badge variant="secondary" className={`${getCategoryColor(goal.category)} text-white`}>
              {goal.category}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
        )}
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{progressPercentage.toFixed(0)}% complete</span>
            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {!isUpdating ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickUpdate(-1)}
                disabled={goal.currentValue <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdating(true)}
                className="flex-1"
              >
                Update Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickUpdate(1)}
                disabled={goal.currentValue >= goal.targetValue}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <Input
                type="number"
                value={updateValue}
                onChange={(e) => setUpdateValue(Number(e.target.value))}
                min={0}
                max={goal.targetValue}
                className="flex-1"
              />
              <Button size="sm" onClick={handleManualUpdate}>
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsUpdating(false);
                  setUpdateValue(goal.currentValue);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>
            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
