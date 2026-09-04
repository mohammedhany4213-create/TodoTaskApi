import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Task, TaskPriority, TaskStatus, TaskCategory, SortOption, TaskStats } from '../types';
import { useAuth } from './AuthContext';
import * as todoApi from '../api/todoApi';
import { getApiErrorMessage } from '../api/axios';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: TaskStatus | 'all';
  setStatusFilter: (status: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  priorityFilterState: TaskPriority | 'all';
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  categoryFilter: TaskCategory | 'all';
  setCategoryFilter: (category: TaskCategory | 'all') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isError: boolean;
  setIsError: (error: boolean) => void;
  errorMessage: string;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  deletingTaskId: string | null;
  setDeletingTaskId: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate_asc');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      setTasks(await todoApi.getTasks());
    } catch (error) {
      setIsError(true);
      setErrorMessage(getApiErrorMessage(error, 'Failed to load tasks'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
    else {
      setTasks([]);
      setIsError(false);
      setErrorMessage('');
    }
  }, [isAuthenticated, fetchTasks]);

  const filteredTasks = useMemo(() => tasks
    .filter((task) => {
      const q = searchQuery.trim().toLowerCase();
      if (q && !task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate_asc') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'dueDate_desc') return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      if (sortBy === 'createdAt_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'priority_desc') {
        const weight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return 0;
    }), [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const stats = useMemo<TaskStats>(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    return {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      highPriorityTasks: tasks.filter((task) => task.priority === 'urgent' || task.priority === 'high').length,
    };
  }, [tasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const createdTask = await todoApi.createTask({
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
    });
    setTasks((prev) => [{ ...createdTask, priority: taskData.priority, category: taskData.category }, ...prev]);
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    const existing = tasks.find((task) => task.id === id);
    if (!existing) return;
    const merged = { ...existing, ...taskData };
    await todoApi.updateTask(id, {
      title: merged.title.trim(),
      description: merged.description.trim(),
      isCompleted: merged.status === 'completed',
      dueDate: merged.dueDate ? new Date(merged.dueDate).toISOString() : null,
    });
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, ...taskData, updatedAt: new Date().toISOString().split('T')[0] } : task));
  };

  const deleteTask = async (id: string) => {
    await todoApi.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const isCompleted = task.status !== 'completed';
    await todoApi.updateTask(id, {
      title: task.title,
      description: task.description,
      isCompleted,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    });
    setTasks((prev) => prev.map((item) => item.id === id ? {
      ...item,
      status: isCompleted ? 'completed' : 'todo',
      completedAt: isCompleted ? new Date().toISOString().split('T')[0] : undefined,
      updatedAt: new Date().toISOString().split('T')[0],
    } : item));
  };

  return (
    <TaskContext.Provider value={{
      tasks, filteredTasks, stats, searchQuery, setSearchQuery,
      statusFilter, setStatusFilter, priorityFilter, priorityFilterState: priorityFilter, setPriorityFilter,
      categoryFilter, setCategoryFilter, sortBy, setSortBy,
      isLoading, setIsLoading, isError, setIsError, errorMessage,
      viewMode, setViewMode, fetchTasks, addTask, updateTask, deleteTask, toggleTaskComplete,
      isAddModalOpen, setIsAddModalOpen, editingTask, setEditingTask, deletingTaskId, setDeletingTaskId,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
