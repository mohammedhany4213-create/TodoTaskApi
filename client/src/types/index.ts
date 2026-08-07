export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export type TaskCategory = 'Work' | 'Personal' | 'Design' | 'Engineering' | 'Marketing';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string format YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  highPriorityTasks: number;
}

export type SortOption = 'dueDate_asc' | 'dueDate_desc' | 'createdAt_desc' | 'priority_desc' | 'title_asc';
