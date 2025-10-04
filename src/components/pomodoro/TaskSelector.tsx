import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { getTasks } from '@/services/taskService';
import type { Task } from '@/types/tasks';

interface TaskSelectorProps {
  selectedTask: Task | null;
  onTaskSelect: (task: Task | null) => void;
  className?: string;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ selectedTask, onTaskSelect, className = '' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await getTasks();
        // Filter to show only todo and in-progress tasks
        const activeTasks = fetchedTasks.filter(task => 
          task.status === 'todo' || task.status === 'in-progress'
        );
        setTasks(activeTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskSelect = (task: Task) => {
    onTaskSelect(task);
    setIsExpanded(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className={`bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-white/80" />
            <span className="text-white/90 font-medium text-sm">Current Task</span>
          </div>
          {tasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {selectedTask ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="text-white text-sm font-medium leading-tight">
                {selectedTask.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTaskSelect(null)}
                className="text-white/60 hover:text-white/80 hover:bg-white/10 p-1 ml-2"
              >
                ×
              </Button>
            </div>
            {selectedTask.description && (
              <p className="text-white/70 text-xs">
                {selectedTask.description}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getPriorityColor(selectedTask.priority || 'medium')}`}>
                {selectedTask.priority || 'medium'}
              </Badge>
              {selectedTask.dueDate && (
                <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-white/60 text-sm">
              {tasks.length > 0 ? 'Select a task to focus on' : 'No active tasks available'}
            </p>
          </div>
        )}

        {isExpanded && tasks.length > 0 && (
          <div className="mt-4 border-t border-white/20 pt-4">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskSelect(task)}
                    className="p-2 rounded cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white text-xs font-medium truncate">
                          {task.title}
                        </h5>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge className={`text-xs ${getPriorityColor(task.priority || 'medium')}`}>
                            {task.priority || 'medium'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <p className="text-white/50 text-xs text-center py-1">
                    +{tasks.length - 5} more tasks
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskSelector;
