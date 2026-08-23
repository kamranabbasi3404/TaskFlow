import React from 'react';
import { TaskFilterOptions, TaskPriority, TaskStatus } from '@/types';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, Kanban, X } from 'lucide-react';

interface TaskFilterBarProps {
  filterOptions: TaskFilterOptions;
  onFilterChange: (newOptions: Partial<TaskFilterOptions>) => void;
  totalResults: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filterOptions,
  onFilterChange,
  totalResults,
}) => {
  const hasActiveFilters =
    filterOptions.search.trim() !== '' ||
    filterOptions.status !== 'All' ||
    filterOptions.priority !== 'All';

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'All',
      priority: 'All',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description as you type..."
            value={filterOptions.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          {filterOptions.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns: Status, Priority, Sorting & View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">Status:</span>
            <select
              value={filterOptions.status}
              onChange={(e) =>
                onFilterChange({ status: e.target.value as TaskStatus | 'All' })
              }
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-slate-900">All Statuses</option>
              <option value="To Do" className="bg-white dark:bg-slate-900">To Do</option>
              <option value="In Progress" className="bg-white dark:bg-slate-900">In Progress</option>
              <option value="Done" className="bg-white dark:bg-slate-900">Done</option>
            </select>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">Priority:</span>
            <select
              value={filterOptions.priority}
              onChange={(e) =>
                onFilterChange({ priority: e.target.value as TaskPriority | 'All' })
              }
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-slate-900">All Priorities</option>
              <option value="High" className="bg-white dark:bg-slate-900">High</option>
              <option value="Medium" className="bg-white dark:bg-slate-900">Medium</option>
              <option value="Low" className="bg-white dark:bg-slate-900">Low</option>
            </select>
          </div>

          {/* Sort By Dropdown (Due Date Newest/Oldest) */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">Sort:</span>
            <select
              value={filterOptions.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as TaskFilterOptions['sortBy'],
                })
              }
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="dueDateAsc" className="bg-white dark:bg-slate-900">Due Date (Soonest first)</option>
              <option value="dueDateDesc" className="bg-white dark:bg-slate-900">Due Date (Latest first)</option>
              <option value="priority" className="bg-white dark:bg-slate-900">Priority (High to Low)</option>
              <option value="createdAt" className="bg-white dark:bg-slate-900">Recently Created</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          {/* View Mode Toggle: Kanban vs List vs Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 ml-auto">
            <button
              onClick={() => onFilterChange({ viewMode: 'kanban' })}
              className={`p-1.5 rounded-lg transition-all ${
                filterOptions.viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Drag & Drop View"
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'list' })}
              className={`p-1.5 rounded-lg transition-all ${
                filterOptions.viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-all ${
                filterOptions.viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>
          Showing <strong className="text-slate-900 dark:text-slate-200">{totalResults}</strong> tasks
          {hasActiveFilters && ' matching active filters'}
        </span>
      </div>
    </div>
  );
};
