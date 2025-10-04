
export interface Notification {
  id: string;
  title: string;
  message: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  read: boolean;
  userId: string;
  timestamp: string;
  createdAt?: string | Date;
}
