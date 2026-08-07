import React from 'react';
import { TaskPriority, TaskStatus, TaskCategory } from '../../types';
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Flame, Tag } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'status' | 'category' | 'default';
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: TaskCategory;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  status,
  category,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
  };

  if (variant === 'priority' && priority) {
    const priorityConfig = {
      urgent: {
        label: 'Urgent',
        icon: <Flame className="w-3 h-3 text-rose-500" />,
        style: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      },
      high: {
        label: 'High',
        icon: <ArrowUpRight className="w-3 h-3 text-amber-500" />,
        style: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      },
      medium: {
        label: 'Medium',
        icon: <Clock className="w-3 h-3 text-sky-500" />,
        style: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
      },
      low: {
        label: 'Low',
        icon: <AlertCircle className="w-3 h-3 text-slate-400" />,
        style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      },
    };

    const config = priorityConfig[priority];
    return (
      <span
        className={`inline-flex items-center rounded-full border ${config.style} ${sizeStyles[size]} ${className}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  if (variant === 'status' && status) {
    const statusConfig = {
      todo: {
        label: 'To Do',
        icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />,
        style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      },
      in_progress: {
        label: 'In Progress',
        icon: <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />,
        style: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
      },
      completed: {
        label: 'Completed',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
        style: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      },
      archived: {
        label: 'Archived',
        icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />,
        style: 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800',
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center rounded-full border ${config.style} ${sizeStyles[size]} ${className}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  if (variant === 'category' && category) {
    return (
      <span
        className={`inline-flex items-center rounded-full border bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 ${sizeStyles[size]} ${className}`}
      >
        <Tag className="w-3 h-3 text-slate-400" />
        <span>{category}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
