
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, BarChart } from "lucide-react";
import CompactTimer from "@/components/CompactTimer";
import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import HabitStreaks from "@/components/dashboard/HabitStreaks";
import RecentActivityTimeline from "@/components/dashboard/RecentActivityTimeline";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTasksSection from "@/components/dashboard/RecentTasksSection";
import { Task } from "@/components/TaskCard";
import { toast } from "sonner";
import { getTasks, updateTask } from "@/services/taskService";
import { getCurrentUser } from "@/lib/auth";

// Motivational quotes array
const motivationalQuotes = [
  "Stay focused. You've got this!",
  "Small progress is still progress.",
  "One task at a time leads to great achievements.",
  "Your future self will thank you for today's effort.",
  "Discipline is choosing between what you want now and what you want most.",
  "The best way to predict your future is to create it.",
  "Focus on the journey, not the destination.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "You don't have to be great to start, but you have to start to be great."
];

const Dashboard: React.FC = () => {
  // Time-based greeting
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  
  // Task and stats state
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Tasks", value: 0, icon: <CheckCircle size={18} /> },
    { title: "In Progress", value: 0, icon: <Clock size={18} /> },
    { title: "Completed", value: 0, icon: <CheckCircle size={18} /> },
    { title: "Completion Rate", value: "0%", icon: <BarChart size={18} /> }
  ]);

  // Fetch data and set initial state
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Determine greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) {
          setGreeting(`Good Morning, ${userName}! 🌅`);
        } else if (hour < 17) {
          setGreeting(`Good Afternoon, ${userName}! 🌞`);
        } else {
          setGreeting(`Good Evening, ${userName}! 🌙`);
        }
        
        const user = getCurrentUser();
        if (user) {
          // Fetch tasks from Firebase
          const tasks = await getTasks();
          setRecentTasks(tasks.slice(0, 4)); // Get 4 most recent tasks
          
          // Calculate task statistics
          const totalTasks = tasks.length;
          const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
          const completedTasks = tasks.filter(task => task.status === 'completed').length;
          const completionRate = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100) 
            : 0;
          
          setStats([
            { title: "Total Tasks", value: totalTasks, icon: <CheckCircle size={18} /> },
            { title: "In Progress", value: inProgressTasks, icon: <Clock size={18} /> },
            { title: "Completed", value: completedTasks, icon: <CheckCircle size={18} /> },
            { title: "Completion Rate", value: `${completionRate}%`, icon: <BarChart size={18} /> }
          ]);
        } else {
          // If not authenticated, show mock data for preview
          setRecentTasks([
            {
              id: "1",
              title: "Complete Project Proposal",
              description: "Finish drafting the project proposal document for client review",
              status: "in-progress",
              priority: "high",
              dueDate: "2025-05-01"
            },
            {
              id: "2",
              title: "Weekly Team Meeting",
              description: "Prepare agenda and materials for weekly team sync meeting",
              status: "todo",
              priority: "medium",
              dueDate: "2025-04-28"
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load some dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboard();
  }, [userName]);

  // Add handlers for task card actions
  const handleEditTask = (task: Task) => {
    toast.info(`Edit task: ${task.title}`);
  };

  const handleDeleteTask = (taskId: string) => {
    toast.info(`Delete task: ${taskId}`);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
      
      const updatedTasks = recentTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      setRecentTasks(updatedTasks);
      toast.success("Task status updated");
      
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <DashboardGreeting greeting={greeting} quotes={motivationalQuotes} />

      <DashboardStats stats={stats} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Left Column - Timer and Tasks */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <CompactTimer />
          
          <RecentTasksSection
            tasks={recentTasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Right Column - New Dashboard Components */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <QuickActionsPanel />
          <GoalsProgress />
          <HabitStreaks />
          <RecentActivityTimeline />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
