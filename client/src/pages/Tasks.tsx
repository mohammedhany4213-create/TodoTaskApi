import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTasks } from '../contexts/TaskContext';
import { SearchBar } from '../components/common/SearchBar';
import { FilterBar } from '../components/common/FilterBar';
import { TaskCard } from '../components/tasks/TaskCard';
import { LoadingSkeletonList } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/ui/Button';
import { Plus, ListTodo, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const Tasks: React.FC = () => {
  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    isLoading,
    setIsLoading,
    isError,
    errorMessage,
    fetchTasks,
    viewMode,
    setViewMode,
    toggleTaskComplete,
    setEditingTask,
    setDeletingTaskId,
    setIsAddModalOpen,
  } = useTasks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ListTodo className="w-7 h-7 text-indigo-500" /> Tasks Workspace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage, filter, and track all your workflow tasks in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo toggle triggers */}
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isLoading ? 'Hide Skeleton' : 'Show Skeleton'}
          </button>

          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <ErrorState
          title="Unable to load remote tasks"
          message={errorMessage || 'Server disconnected unexpectedly.'}
          onRetry={fetchTasks}
        />
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-2xl shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, description, or category..."
        />

        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Main Task List / Cards Grid */}
      {isLoading ? (
        <LoadingSkeletonList count={6} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={searchQuery || statusFilter !== 'all' ? 'No matching tasks found' : 'No tasks yet'}
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try clearing your search query or filters to see all tasks.'
              : 'Create your first task to begin organizing your work.'
          }
          iconType={searchQuery ? 'search' : 'tasks'}
          actionLabel="Create Task"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                viewMode={viewMode}
                onToggleComplete={toggleTaskComplete}
                onEdit={setEditingTask}
                onDelete={setDeletingTaskId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
