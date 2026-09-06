import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Task, TaskStatus, SortOption, TaskStats } from '../types';
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
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: { title: string; description: string; dueDate?: string | null }) => Promise<void>;
  updateTask: (id: string, taskData: { title: string; description: string; isCompleted: boolean; dueDate?: string | null }) => Promise<void>;
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
      const result = await todoApi.getTasks(1, 100);
      setTasks(result.items.map(todoApi.mapApiTaskToTask));
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
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate_asc') return new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime();
      if (sortBy === 'dueDate_desc') return new Date(b.dueDate || '1900-01-01').getTime() - new Date(a.dueDate || '1900-01-01').getTime();
      if (sortBy === 'createdAt_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return 0;
    }), [tasks, searchQuery, statusFilter, sortBy]);

  const stats = useMemo<TaskStats>(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    return {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [tasks]);

  const addTask = async (taskData: { title: string; description: string; dueDate?: string | null }) => {
    const createdTask = await todoApi.createTask({
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      dueDate: taskData.dueDate || null,
    });
    setTasks((prev) => [createdTask, ...prev]);
  };

  const updateTask = async (id: string, taskData: { title: string; description: string; isCompleted: boolean; dueDate?: string | null }) => {
    await todoApi.updateTask(id, taskData);
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await todoApi.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    await updateTask(id, {
      title: task.title,
      description: task.description,
      isCompleted: task.status !== 'completed',
      dueDate: task.dueDate || null,
    });
  };

  return (
    <TaskContext.Provider value={{
      tasks, filteredTasks, stats, searchQuery, setSearchQuery,
      statusFilter, setStatusFilter, sortBy, setSortBy,
      isLoading, isError, errorMessage, viewMode, setViewMode,
      fetchTasks, addTask, updateTask, deleteTask, toggleTaskComplete,
      isAddModalOpen, setIsAddModalOpen, editingTask, setEditingTask,
      deletingTaskId, setDeletingTaskId,
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
