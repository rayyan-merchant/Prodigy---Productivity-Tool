import React, { useState, useEffect } from 'react';
import { Plus, Target, Edit, Trash2, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Goal } from '@/types/goals';
import GoalForm from '@/components/goals/GoalForm';
import GoalCard from '@/components/goals/GoalCard';
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/services/goalService';
import { toast } from 'sonner';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'personal' | 'work' | 'health' | 'learning' | 'other'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const fetchedGoals = await getGoals();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGoals = goals.filter(goal => filter === 'all' || goal.category === filter);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

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

  const handleCreateGoal = async (goalData: Partial<Goal>) => {
    try {
      const newGoal = await createGoal({
        title: goalData.title!,
        description: goalData.description,
        targetValue: goalData.targetValue!,
        currentValue: 0,
        unit: goalData.unit!,
        category: goalData.category!,
        deadline: goalData.deadline!,
        isCompleted: false
      });
      
      setGoals([newGoal, ...goals]);
      setIsCreateDialogOpen(false);
      toast.success('Goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleEditGoal = async (goalData: Partial<Goal>) => {
    if (!selectedGoal) return;
    
    try {
      await updateGoal(selectedGoal.id, goalData);
      
      const updatedGoal: Goal = {
        ...selectedGoal,
        ...goalData,
        updatedAt: new Date().toISOString()
      };
      
      setGoals(goals.map(goal => goal.id === selectedGoal.id ? updatedGoal : goal));
      setIsEditDialogOpen(false);
      setSelectedGoal(null);
      toast.success('Goal updated successfully!');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    try {
      const isCompleted = newValue >= goals.find(g => g.id === goalId)?.targetValue!;
      await updateGoal(goalId, { 
        currentValue: newValue,
        isCompleted
      });
      
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              currentValue: newValue,
              isCompleted,
              updatedAt: new Date().toISOString()
            }
          : goal
      ));
      
      if (isCompleted) {
        toast.success('Congratulations! Goal completed! 🎉');
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex justify-center my-12">
          <p>Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and achieve your objectives
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#D2353E] hover:bg-[#B91C26]">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalGoals}</p>
              </div>
              <Target className="h-8 w-8 text-[#D2353E]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedGoals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'personal', 'work', 'health', 'learning', 'other'].map((category) => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category as typeof filter)}
            className={filter === category ? 'bg-[#D2353E] hover:bg-[#B91C26]' : ''}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={(goal) => {
              setSelectedGoal(goal);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteGoal}
            onUpdateProgress={handleUpdateProgress}
          />
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {filter === 'all' ? 'No goals yet' : `No ${filter} goals found`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by creating your first goal to track your progress
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#D2353E] hover:bg-[#B91C26]">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      )}

      {/* Create Goal Dialog */}
      <GoalForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateGoal}
        goal={null}
      />

      {/* Edit Goal Dialog */}
      <GoalForm
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedGoal(null);
        }}
        onSave={handleEditGoal}
        goal={selectedGoal}
      />
    </div>
  );
};

export default Goals;
