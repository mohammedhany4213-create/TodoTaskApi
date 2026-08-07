import React from 'react';
import { Button } from '../ui/Button';
import { Plus, SearchX, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconType?: 'search' | 'tasks' | 'completed';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks yet',
  description = 'Get started by creating your first task or modifying your filter search criteria.',
  actionLabel = 'Create New Task',
  onAction,
  iconType = 'tasks',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 my-4">
      {/* Modern SVG Illustration Box */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
        {iconType === 'search' ? (
          <SearchX className="w-8 h-8" />
        ) : iconType === 'completed' ? (
          <CheckCircle2 className="w-8 h-8" />
        ) : (
          <div className="relative">
            <div className="w-7 h-7 rounded-lg border-2 border-indigo-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>

      {onAction && (
        <div className="mt-6">
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
