
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Habit } from '@/types/goals';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  habit: Habit | null;
}

const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, onSave, habit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal' as Habit['category'],
    frequency: 'daily' as Habit['frequency'],
    targetStreak: 7
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        category: habit.category,
        frequency: habit.frequency,
        targetStreak: habit.targetStreak
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'personal',
        frequency: 'daily',
        targetStreak: 7
      });
    }
  }, [habit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter habit name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your habit (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as Habit['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as Habit['frequency'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetStreak">Target Streak (days)</Label>
              <Input
                id="targetStreak"
                type="number"
                value={formData.targetStreak}
                onChange={(e) => setFormData({ ...formData, targetStreak: Number(e.target.value) })}
                min={1}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#D2353E] hover:bg-[#B91C26]">
              {habit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
