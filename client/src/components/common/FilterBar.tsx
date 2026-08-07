import React from 'react';
import { TaskStatus, TaskPriority, TaskCategory, SortOption } from '../../types';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { ArrowUpDown, Grid, List } from 'lucide-react';

interface FilterBarProps {
  statusFilter: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  categoryFilter: TaskCategory | 'all';
  onCategoryChange: (category: TaskCategory | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  const statusOptions: { id: TaskStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Status' },
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const priorityOptions: { id: TaskPriority | 'all'; label: string }[] = [
    { id: 'all', label: 'All Priority' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const categoryOptions: { id: TaskCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'Engineering', label: 'Engineering' },
    { id: 'Design', label: 'Design' },
    { id: 'Work', label: 'Work' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Personal', label: 'Personal' },
  ];

  const sortItems: DropdownItem[] = [
    { id: 'dueDate_asc', label: 'Due Date (Earliest First)' },
    { id: 'dueDate_desc', label: 'Due Date (Latest First)' },
    { id: 'priority_desc', label: 'Priority (Highest First)' },
    { id: 'createdAt_desc', label: 'Recently Created' },
    { id: 'title_asc', label: 'Title (A-Z)' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onStatusChange(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Priority, Category, Sort Dropdown & View Mode */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
        >
          {priorityOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as TaskCategory | 'all')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
        >
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <Dropdown
          label="Sort"
          trigger={
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort</span>
            </button>
          }
          items={sortItems}
          selectedId={sortBy}
          onSelect={(item) => onSortChange(item.id as SortOption)}
        />

        {/* Grid / List View Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 ml-auto sm:ml-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : ''
            }`}
            title="Grid View"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : ''
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
