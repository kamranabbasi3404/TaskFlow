import React from 'react';
import { TaskPriority, TaskStatus } from '@/types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const styles = {
    High: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border transition-all ${styles[priority]} ${sizeClasses}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          priority === 'High'
            ? 'bg-rose-500'
            : priority === 'Medium'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      {priority} Priority
    </span>
  );
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles = {
    'To Do': 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    'In Progress': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    Done: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${styles[status]} ${sizeClasses}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === 'Done'
            ? 'bg-teal-500'
            : status === 'In Progress'
            ? 'bg-indigo-500'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};
