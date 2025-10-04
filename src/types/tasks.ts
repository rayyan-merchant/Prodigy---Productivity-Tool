
export interface Task {
  id: string;
  title: string;
  description: string; 
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  userId: string;
  tags?: string[];
  project?: string;
  estimatedTime?: number; // in minutes
  status: 'todo' | 'in-progress' | 'completed';
  completedAt?: string | Date;
}
