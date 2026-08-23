import React from 'react';
import { Task, Workspace, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { formatDate } from '@/lib/utils';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Edit3, Trash2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskListViewProps {
  tasks: Task[];
  workspaces: Workspace[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  viewMode: 'list' | 'grid';
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  workspaces,
  onEdit,
  onDelete,
  onStatusChange,
  viewMode,
}) => {
  const getWorkspaceForTask = (workspaceId: string) => {
    return workspaces.find((w) => w._id === workspaceId);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No tasks found</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Try adjusting your search query, status or priority filters, or create a new task.
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            workspace={getWorkspaceForTask(task.workspaceId)}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    );
  }

  // Structured List / Table View
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-10"></th>
              <th className="py-3.5 px-4">Task Name & Description</th>
              <th className="py-3.5 px-4">Workspace</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map((task) => {
              const ws = getWorkspaceForTask(task.workspaceId);
              const isDone = task.status === 'Done';
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const due = new Date(task.dueDate);
              due.setHours(0, 0, 0, 0);
              const isOverdue = !isDone && due < today;

              return (
                <tr
                  key={task._id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    isDone ? 'opacity-70 bg-slate-50/40 dark:bg-slate-900/30' : ''
                  }`}
                >
                  {/* Done Checkbox */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        const next = isDone ? 'To Do' : 'Done';
                        if (next === 'Done') {
                          try {
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
                          } catch {}
                        }
                        onStatusChange(task._id, next);
                      }}
                      className="text-slate-400 hover:text-teal-500 transition-colors"
                      title={isDone ? 'Mark To Do' : 'Mark Done'}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          isDone ? 'text-teal-500 fill-teal-500/20' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <div
                      className={`font-semibold text-slate-900 dark:text-slate-100 ${
                        isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Workspace */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {ws ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: ws.color || '#6366f1' }}
                        />
                        {ws.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">General</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                      className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        isOverdue
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isOverdue ? (
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <Calendar className="h-3.5 w-3.5" />
                      )}
                      {formatDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
