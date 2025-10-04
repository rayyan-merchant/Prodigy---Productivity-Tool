import React, { useState, useEffect } from 'react';
import { Plus, Flame, Edit, Trash2, CheckCircle, X, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit } from '@/types/goals';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { getHabits, createHabit, updateHabit, deleteHabit } from '@/services/habitService';
import { toast } from 'sonner';

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [filter, setFilter] = useState<'all' | 'health' | 'productivity' | 'personal' | 'learning' | 'other'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const fetchedHabits = await getHabits();
      setHabits(fetchedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHabits = habits.filter(habit => filter === 'all' || habit.category === filter);

  const handleCreateHabit = async (habitData: Partial<Habit>) => {
    try {
      const newHabit = await createHabit({
        name: habitData.name!,
        description: habitData.description,
        category: habitData.category!,
        frequency: habitData.frequency!,
        targetStreak: habitData.targetStreak!,
        currentStreak: 0,
        longestStreak: 0,
        completedDates: [],
        isActive: true
      });
      
      setHabits([newHabit, ...habits]);
      setIsCreateDialogOpen(false);
      toast.success('Habit created successfully!');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const handleEditHabit = async (habitData: Partial<Habit>) => {
    if (!selectedHabit) return;
    
    try {
      await updateHabit(selectedHabit.id, habitData);
      
      const updatedHabit: Habit = {
        ...selectedHabit,
        ...habitData,
        updatedAt: new Date().toISOString()
      };
      
      setHabits(habits.map(habit => habit.id === selectedHabit.id ? updatedHabit : habit));
      setIsEditDialogOpen(false);
      setSelectedHabit(null);
      toast.success('Habit updated successfully!');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      setHabits(habits.filter(habit => habit.id !== habitId));
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleMarkComplete = async (habitId: string) => {
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
      
      setHabits(habits.map(h => h.id === habitId ? {
        ...h,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        completedDates: newCompletedDates,
        updatedAt: new Date().toISOString()
      } : h));
      
      toast.success(`Great job! ${newStreak} day streak! 🔥`);
    } catch (error) {
      console.error('Error marking habit complete:', error);
      toast.error('Failed to mark habit as complete');
    }
  };

  const handleMarkIncomplete = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    try {
      const newStreak = Math.max(0, habit.currentStreak - 1);
      
      await updateHabit(habitId, {
        currentStreak: newStreak
      });
      
      setHabits(habits.map(h => h.id === habitId ? {
        ...h,
        currentStreak: newStreak,
        updatedAt: new Date().toISOString()
      } : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.isActive).length;
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex justify-center my-12">
          <p>Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Habits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Build consistent routines and track your progress
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#D2353E] hover:bg-[#B91C26]">
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHabits}</p>
              </div>
              <Flame className="h-8 w-8 text-[#D2353E]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeHabits}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageStreak}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'health', 'productivity', 'personal', 'learning', 'other'] as const).map((category) => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category)}
            className={filter === category ? 'bg-[#D2353E] hover:bg-[#B91C26]' : ''}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={(habit) => {
              setSelectedHabit(habit);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteHabit}
            onMarkComplete={handleMarkComplete}
            onMarkIncomplete={handleMarkIncomplete}
          />
        ))}
      </div>

      {filteredHabits.length === 0 && (
        <div className="text-center py-12">
          <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {filter === 'all' ? 'No habits yet' : `No ${filter} habits found`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start building positive habits to improve your daily routine
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#D2353E] hover:bg-[#B91C26]">
            <Plus className="h-4 w-4 mr-2" />
            Create Habit
          </Button>
        </div>
      )}

      {/* Create Habit Dialog */}
      <HabitForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateHabit}
        habit={null}
      />

      {/* Edit Habit Dialog */}
      <HabitForm
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedHabit(null);
        }}
        onSave={handleEditHabit}
        habit={selectedHabit}
      />
    </div>
  );
};

export default Habits;
