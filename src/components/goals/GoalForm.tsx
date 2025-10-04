
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
import { Goal } from '@/types/goals';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Partial<Goal>) => void;
  goal: Goal | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, onSave, goal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: '',
    category: 'personal' as Goal['category'],
    deadline: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        targetValue: goal.targetValue,
        unit: goal.unit,
        category: goal.category,
        deadline: goal.deadline.split('T')[0] // Format for date input
      });
    } else {
      setFormData({
        title: '',
        description: '',
        targetValue: 0,
        unit: '',
        category: 'personal',
        deadline: ''
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter goal title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="targetValue">Target Value</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                  min={1}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., books, hours, dollars"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Goal['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#D2353E] hover:bg-[#B91C26]">
              {goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;
