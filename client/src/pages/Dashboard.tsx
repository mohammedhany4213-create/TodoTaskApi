import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTasks } from '../contexts/TaskContext';
import { StatCard } from '../components/common/StatCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { LoadingSkeletonList } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Activity,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    stats,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
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
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Workspace Overview 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">Alex</span>. Here's what needs your attention today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Demo Toggle State Buttons */}
          <button
            onClick={() => {
              setIsLoading(!isLoading);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Skeleton Loader State"
          >
            {isLoading ? 'Disable Skeleton' : 'Test Skeleton'}
          </button>

          <button
            onClick={() => {
              setIsError(!isError);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Toggle Error Banner State"
          >
            {isError ? 'Clear Error' : 'Test Error'}
          </button>

          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Optional Error Banner State */}
      {isError && (
        <ErrorState
          title="Failed to sync workspace updates"
          message={errorMessage || 'Unable to reach the server.'}
          onRetry={fetchTasks}
        />
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle="All active and archived items"
          icon={<ListTodo className="w-5 h-5" />}
          trend={{ value: '+12%', isPositive: true }}
          accentColor="indigo"
        />

        <StatCard
          title="Completed"
          value={stats.completedTasks}
          subtitle="Successfully closed tasks"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ value: '+8%', isPositive: true }}
          accentColor="emerald"
        />

        <StatCard
          title="Pending"
          value={stats.pendingTasks}
          subtitle="In progress or to do"
          icon={<Clock className="w-5 h-5" />}
          trend={{ value: '-5%', isPositive: true }}
          accentColor="amber"
        />

        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="Productivity efficiency index"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: '+4%', isPositive: true }}
          accentColor="violet"
        />
      </div>

      {/* Main Content Area: Recent Tasks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Recent Tasks
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                {recentTasks.length} items
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/tasks')}
            >
              View All Tasks
            </Button>
          </div>

          {/* Render Loading Skeleton OR Recent Tasks List */}
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
        </div>

        {/* Activity Feed Column (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Recent Activity
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Real-time log</span>
          </div>

          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-5 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  AM
                </div>
                <div>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Alex Morgan</span> marked{' '}
                    <span className="font-medium underline">Prepare Q3 Product Roadmap</span> as completed.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">12 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                  CI
                </div>
                <div>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">CI/CD Deployer</span> updated task{' '}
                    <span className="font-medium underline">Setup Automated CI/CD</span>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">AI Assistant</span> auto-categorized task{' '}
                    <span className="font-medium underline">Refactor Authentication</span>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
                </div>
              </div>
            </div>

            {/* High Density Tip Box */}
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden shadow-md">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" /> Productivity Tip
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Use filter tags and custom sorting to focus on high & urgent engineering priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
