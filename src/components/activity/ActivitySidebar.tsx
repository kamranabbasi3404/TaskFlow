import React from 'react';
import { Activity } from '@/types';
import { formatTimeAgo } from '@/lib/utils';
import {
  X,
  History,
  PlusCircle,
  CheckCircle2,
  Edit,
  Trash2,
  FolderPlus,
  Activity as ActivityIcon,
} from 'lucide-react';

interface ActivitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onClearActivities?: () => void;
}

export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
  isOpen,
  onClose,
  activities,
  onClearActivities,
}) => {
  if (!isOpen) return null;

  // Ensure displaying the last 5 actions as explicitly requested in assignment!
  const recentFiveActivities = activities.slice(0, 5);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'task_created':
        return <PlusCircle className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'task_status_changed':
        return <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />;
      case 'task_updated':
        return <Edit className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'task_deleted':
        return <Trash2 className="h-4 w-4 text-rose-500 shrink-0" />;
      case 'workspace_created':
        return <FolderPlus className="h-4 w-4 text-purple-500 shrink-0" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recent Activity Log
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing last 5 user actions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Activity Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {recentFiveActivities.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ActivityIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No actions logged yet</p>
                <p className="text-xs mt-1">Actions will appear here as you interact with tasks.</p>
              </div>
            ) : (
              recentFiveActivities.map((act) => (
                <div
                  key={act._id}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <div className="mt-0.5">{getActionIcon(act.action)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {act.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                      {act.workspaceName && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {act.workspaceName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
            <span>Auto-saved to log</span>
            {onClearActivities && recentFiveActivities.length > 0 && (
              <button
                onClick={onClearActivities}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
