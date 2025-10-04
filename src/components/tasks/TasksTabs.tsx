
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/types/tasks";
import TaskList from "@/components/tasks/TaskList";

interface TasksTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tasks: Task[];
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TasksTabs: React.FC<TasksTabsProps> = ({
  activeTab,
  onTabChange,
  tasks,
  todoTasks,
  inProgressTasks,
  completedTasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-6">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          emptyMessage="No tasks found. Create a new task to get started."
        />
      </TabsContent>

      <TabsContent value="todo" className="mt-6">
        <TaskList
          tasks={todoTasks}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          emptyMessage="No to-do tasks found."
        />
      </TabsContent>

      <TabsContent value="in-progress" className="mt-6">
        <TaskList
          tasks={inProgressTasks}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          emptyMessage="No in-progress tasks found."
        />
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <TaskList
          tasks={completedTasks}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          emptyMessage="No completed tasks found."
        />
      </TabsContent>
    </Tabs>
  );
};

export default TasksTabs;
