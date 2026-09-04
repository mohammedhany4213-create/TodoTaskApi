import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { StatCard } from '../components/common/StatCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { LoadingSkeletonList } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { ListTodo, CheckCircle2, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    stats,
    isLoading,
    isError,
    errorMessage,
    fetchTasks,
    toggleTaskComplete,
    setEditingTask,
    setDeletingTaskId,
    setIsAddModalOpen,
  } = useTasks();

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Stay on top of your tasks and keep your work moving forward.
          </p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
          New Task
        </Button>
      </div>

      {isError && (
        <ErrorState
          title="Unable to load your tasks"
          message={errorMessage || 'Please check your connection and try again.'}
          onRetry={fetchTasks}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle="Tasks in your workspace"
          icon={<ListTodo className="w-5 h-5" />}
          accentColor="indigo"
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          subtitle="Successfully completed"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Pending"
          value={stats.pendingTasks}
          subtitle="Still to be completed"
          icon={<Clock className="w-5 h-5" />}
          accentColor="amber"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="Of your tasks completed"
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="violet"
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Tasks</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {recentTasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/tasks')}
          >
            View All
          </Button>
        </div>

        {isLoading ? (
          <LoadingSkeletonList count={3} />
        ) : recentTasks.length === 0 ? (
          <EmptyState onAction={() => setIsAddModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onEdit={setEditingTask}
                onDelete={setDeletingTaskId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
