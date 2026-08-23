import React from 'react';
import { Task, Workspace, TaskStatus } from '@/types';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  workspace?: Workspace;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  workspace,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isDone = task.status === 'Done';

  // Check if overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  const isOverdue = !isDone && due < today;

  const handleToggleDone = () => {
    const nextStatus: TaskStatus = isDone ? 'To Do' : 'Done';
    if (nextStatus === 'Done') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    }
    onStatusChange(task._id, nextStatus);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-500/40 ${
        isDone ? 'opacity-80 bg-slate-50/50 dark:bg-slate-900/40' : ''
      }`}
    >
      {/* Top Meta Header: Workspace Badge & Priority */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {workspace ? (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: workspace.color || '#6366f1' }}
            />
            <span className="truncate max-w-[120px]">{workspace.name}</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Workspace</span>
        )}

        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <button
            onClick={handleToggleDone}
            className={`mt-0.5 rounded-full transition-all shrink-0 ${
              isDone
                ? 'text-teal-500 hover:text-teal-600 dark:text-teal-400'
                : 'text-slate-300 hover:text-indigo-500 dark:text-slate-700 dark:hover:text-indigo-400'
            }`}
            title={isDone ? 'Mark as To Do' : 'Mark as Done'}
          >
            <CheckCircle2 className={`h-5 w-5 ${isDone ? 'fill-teal-500/20' : ''}`} />
          </button>
          <h3
            className={`text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug ${
              isDone ? 'line-through text-slate-500 dark:text-slate-500' : ''
            }`}
          >
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pl-7 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Card Footer: Due Date & Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1.5 font-medium ${
            isOverdue
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : isDone
              ? 'text-slate-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          title={isOverdue ? 'This task is overdue!' : `Due ${task.dueDate}`}
        >
          {isOverdue ? (
            <AlertCircle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
          ) : (
            <Calendar className="h-3.5 w-3.5" />
          )}
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Status Badge & Action Controls */}
        <div className="flex items-center gap-1">
          {/* Quick Status Select */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
            className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit task"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
