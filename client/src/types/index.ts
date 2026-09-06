export type TaskStatus = 'todo' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

export type SortOption = 'dueDate_asc' | 'dueDate_desc' | 'createdAt_desc' | 'title_asc';
