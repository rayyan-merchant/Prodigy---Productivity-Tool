
import React, { useState, useEffect } from 'react';
import { Task } from "@/types/tasks";
import { toast } from "sonner";
import { getTasks, addTask, updateTask, deleteTask, getTasksByStatus } from '@/services/taskService';
import { prioritizeTasks } from "@/services/aiService";
import { getCurrentUser } from "@/lib/auth";
import { createTaskActivity } from '@/services/activityService';

interface TasksContainerProps {
  children: (props: {
    tasks: Task[];
    isLoading: boolean;
    isRefreshing: boolean;
    selectedTask: Task | null;
    taskToDelete: string | null;
    activeTab: string;
    isPrioritizing: boolean;
    isDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    todoTasks: Task[];
    inProgressTasks: Task[];
    completedTasks: Task[];
    handleAddTask: (values: any) => Promise<void>;
    handleEditTask: (values: any) => Promise<void>;
    handleStatusChange: (taskId: string, newStatus: Task['status']) => Promise<void>;
    handleDeleteTask: () => Promise<void>;
    openEditDialog: (task: Task) => void;
    openDeleteDialog: (taskId: string) => void;
    handleTabChange: (value: string) => void;
    handlePrioritizeTasks: () => Promise<void>;
    setIsDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setSelectedTask: (task: Task | null) => void;
    setTaskToDelete: (id: string | null) => void;
  }) => React.ReactNode;
}

const TasksContainer: React.FC<TasksContainerProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleCreateTask = () => {
      setIsDialogOpen(true);
    };

    window.addEventListener('createTask', handleCreateTask);
    return () => window.removeEventListener('createTask', handleCreateTask);
  }, []);

  const fetchTasks = async () => {
    try {
      setIsRefreshing(true);
      let fetchedTasks: Task[];
      
      if (activeTab === "all") {
        fetchedTasks = await getTasks();
      } else {
        fetchedTasks = await getTasksByStatus(activeTab as Task['status']);
      }
      
      setTasks(fetchedTasks);
      
      if (fetchedTasks.length === 0 && !isLoading) {
        setTimeout(async () => {
          try {
            const retryTasks = activeTab === "all" 
              ? await getTasks() 
              : await getTasksByStatus(activeTab as Task['status']);
            setTasks(retryTasks);
          } catch (retryError) {
            console.error('Error on retry fetch:', retryError);
          } finally {
            setIsRefreshing(false);
          }
        }, 1000);
      } else {
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
      setIsRefreshing(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const completedTasks = tasks.filter(task => task.status === "completed");

  const handleAddTask = async (values: any) => {
    try {
      const user = getCurrentUser();
      const userId = user?.uid || 'anonymous';
      
      const newTask = {
        title: values.title,
        description: values.description,
        status: "todo" as const,
        priority: values.priority as Task['priority'],
        dueDate: values.dueDate,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()) || [],
        completed: false,
        userId: userId
      };
      
      await addTask(newTask);
      toast.success("Task created successfully");
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleEditTask = async (values: any) => {
    if (!selectedTask) return;
    
    try {
      const updatedTask = {
        ...values,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()) || selectedTask.tags
      };
      
      await updateTask(selectedTask.id, updatedTask);
      toast.success("Task updated successfully");
      setSelectedTask(null);
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete);
      toast.success("Task deleted successfully");
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handlePrioritizeTasks = async () => {
    const tasksToOrder = tasks.filter(task => task.status !== 'completed');
    
    if (tasksToOrder.length < 2) {
      toast.info("Need at least two tasks to prioritize");
      return;
    }
    
    try {
      setIsPrioritizing(true);
      toast.loading("AI is prioritizing your tasks...");
      
      const prioritizedTaskIds = await prioritizeTasks(tasksToOrder);
      
      if (prioritizedTaskIds && prioritizedTaskIds.length) {
        const taskMap = tasks.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {} as Record<string, Task>);
        
        let order = 0;
        for (const taskId of prioritizedTaskIds) {
          const task = taskMap[taskId];
          if (task) {
            await updateTask(taskId, { 
              priority: order < 3 ? 'high' : order < 6 ? 'medium' : 'low'
            });
            order++;
          }
        }
        
        toast.success("Tasks prioritized successfully");
        fetchTasks();
      }
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      toast.error('Failed to prioritize tasks');
    } finally {
      setIsPrioritizing(false);
    }
  };

  return children({
    tasks,
    isLoading,
    isRefreshing,
    selectedTask,
    taskToDelete,
    activeTab,
    isPrioritizing,
    isDialogOpen,
    isDeleteDialogOpen,
    todoTasks,
    inProgressTasks,
    completedTasks,
    handleAddTask,
    handleEditTask,
    handleStatusChange,
    handleDeleteTask,
    openEditDialog,
    openDeleteDialog,
    handleTabChange,
    handlePrioritizeTasks,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedTask,
    setTaskToDelete,
  });
};

export default TasksContainer;
