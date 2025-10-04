
import React from 'react';
import TaskCard, { Task } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  emptyMessage?: string;
  onRefetch?: () => void;
  error?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  emptyMessage = "No tasks found.",
  onRefetch,
  error = null
}) => {
  const handleRefetch = () => {
    if (onRefetch) {
      toast.info("Refreshing tasks...");
      onRefetch();
    }
  };

  if (isLoading) {
    return (
      <div className="col-span-3 text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-3 text-center py-8 space-y-4">
        <p className="text-destructive dark:text-red-400">{error}</p>
        <Button 
          variant="outline" 
          onClick={handleRefetch} 
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="col-span-3 text-center py-8">
        <p className="text-muted-foreground dark:text-gray-400">{emptyMessage}</p>
        {onRefetch && (
          <Button 
            variant="outline" 
            onClick={handleRefetch} 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
