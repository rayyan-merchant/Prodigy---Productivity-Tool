
import React from 'react';
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCard, { Task } from "@/components/TaskCard";

interface RecentTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const RecentTasksSection: React.FC<RecentTasksSectionProps> = ({
  tasks,
  isLoading,
  onEditTask,
  onDeleteTask,
  onStatusChange
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Recent Tasks</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 hover:bg-[#D2353E]/10 hover:text-[#D2353E] hover:border-[#D2353E]"
            onClick={() => window.location.href = '/tasks'}
          >
            View All <ArrowRight size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 animate-pulse">
            {[1, 2].map((_, i) => (
              <div key={i} className="bg-muted h-20 rounded-md"></div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.href = '/tasks'}
            >
              Create your first task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTasksSection;
