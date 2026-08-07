import React from 'react';
import { motion } from 'motion/react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, Edit3, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  viewMode = 'grid',
}) => {
  const isCompleted = task.status === 'completed';

  // Check if task is overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate < todayStr;
  const isDueToday = !isCompleted && task.dueDate === todayStr;

  // Formatting date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -1 }}
        className={`group relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-4 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isCompleted ? 'opacity-70 dark:opacity-60 bg-slate-50/50 dark:bg-slate-950/40' : ''
        }`}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Checkbox Complete Trigger */}
          <button
            onClick={() => {
              // TODO: Connect Backend
              onToggleComplete(task.id);
            }}
            className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-sm font-bold text-slate-900 dark:text-slate-100 ${
                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
              >
                {task.title}
              </h4>
              <Badge variant="category" category={task.category} size="sm" />
              <Badge variant="priority" priority={task.priority} size="sm" />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {task.description}
            </p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              isOverdue
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                : isDueToday
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {isOverdue ? 'Overdue' : isDueToday ? 'Today' : formatDate(task.dueDate)}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                // TODO: Connect Backend
                onEdit(task);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                // TODO: Connect Backend
                onDelete(task.id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`group relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 transition-all duration-200 shadow-xs hover:shadow-xl flex flex-col justify-between ${
        isCompleted
          ? 'opacity-70 dark:opacity-60 bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/50'
          : ''
      }`}
    >
      {/* Top Header: Checkbox & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // TODO: Connect Backend
                onToggleComplete(task.id);
              }}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
              title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <Badge variant="status" status={task.status} size="sm" />
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="priority" priority={task.priority} size="sm" />
            <Badge variant="category" category={task.category} size="sm" />
          </div>
        </div>

        {/* Task Title & Description */}
        <h3
          className={`text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug ${
            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {task.description}
        </p>
      </div>

      {/* Footer: Due Date & Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
            isOverdue
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
              : isDueToday
              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <Calendar className="w-3.5 h-3.5" />
          )}
          <span>
            {isOverdue
              ? `Overdue (${formatDate(task.dueDate)})`
              : isDueToday
              ? 'Due Today'
              : formatDate(task.dueDate)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              // TODO: Connect Backend
              onEdit(task);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              // TODO: Connect Backend
              onDelete(task.id);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
