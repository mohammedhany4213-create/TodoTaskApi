import React from 'react';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse shadow-xs">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
        <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const StatSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between animate-pulse shadow-xs">
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  );
};

export const LoadingSkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
};
