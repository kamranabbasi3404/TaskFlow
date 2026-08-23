import React from 'react';
import {
  CheckSquare,
  History,
  Plus,
  Sun,
  Moon,
  Database,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenActivityDrawer: () => void;
  onOpenTaskModal: () => void;
  onSeedData: () => void;
  activityCount: number;
  isSeeding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenActivityDrawer,
  onOpenTaskModal,
  onSeedData,
  activityCount,
  isSeeding = false,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-2.5 w-2.5" /> Next.js
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Organize tasks across workspaces & track history
            </p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Seed Demo Data Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSeedData}
            isLoading={isSeeding}
            title="Reset or seed sample workspaces & tasks"
            className="hidden md:inline-flex"
            icon={<Database className="h-4 w-4" />}
          >
            Reset Demo
          </Button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* Recent Activity Log Trigger Button */}
          <button
            onClick={onOpenActivityDrawer}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5 px-3"
            title="View Recent Activity Log (Last 5 actions)"
          >
            <History className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold hidden sm:inline">Activity Log</span>
            {activityCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
                {activityCount > 5 ? '5+' : activityCount}
              </span>
            )}
          </button>

          {/* New Task Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenTaskModal}
            icon={<Plus className="h-4 w-4" />}
          >
            <span className="hidden xs:inline">New Task</span>
            <span className="xs:hidden">Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
