import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: Date | string;
  completedAt?: Date | string;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  
  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-brand-blue/20 text-brand-blue",
    completed: "bg-green-100 text-green-800"
  };

  const nextStatus: { [key in Task['status']]: Task['status'] } = {
    'todo': 'in-progress',
    'in-progress': 'completed',
    'completed': 'todo'
  };

  const handleStatusClick = () => {
    onStatusChange(task.id, nextStatus[task.status]);
  };

  return (
    <Card className={cn(
      "task-card h-full", 
      task.status === "completed" ? "border-green-200 bg-green-50/30" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {task.status === "completed" && (
              <CheckCircle size={16} className="text-green-500" />
            )}
            {task.title}
          </CardTitle>
          <Badge className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        <div className="flex justify-between items-center">
          <Badge 
            variant="outline" 
            className={cn(statusColors[task.status], "cursor-pointer")}
            onClick={handleStatusClick}
          >
            {task.status === "in-progress" ? "In Progress" : 
              task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
