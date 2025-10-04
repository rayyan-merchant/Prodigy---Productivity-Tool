
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ListFilter, Loader2 } from "lucide-react";

interface TasksHeaderProps {
  onAddTask: () => void;
  onPrioritize: () => void;
  isPrioritizing: boolean;
  isLoading: boolean;
  disablePrioritize: boolean;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({
  onAddTask,
  onPrioritize,
  isPrioritizing,
  isLoading,
  disablePrioritize
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-1">Tasks</h1>
        <p className="text-muted-foreground">Manage and track your tasks</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="gap-1" 
          onClick={onPrioritize}
          disabled={isPrioritizing || isLoading || disablePrioritize}
        >
          {isPrioritizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ListFilter className="h-4 w-4" />
          )}
          Prioritize with AI
        </Button>
        <Button className="gap-1" onClick={onAddTask}>
          <Plus size={16} /> Add Task
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;
