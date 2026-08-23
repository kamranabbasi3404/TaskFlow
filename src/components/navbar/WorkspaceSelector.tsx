import React, { useState } from 'react';
import { Workspace, Task } from '@/types';
import { Layers, Plus, Briefcase, User, Folder, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { validateWorkspaceForm } from '@/lib/validation';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  activeWorkspaceId: string; // 'all' or workspace _id
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string, color: string, description: string) => Promise<void>;
  onDeleteWorkspace: (id: string) => Promise<void>;
  tasks: Task[];
}

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  tasks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getWorkspaceTaskCount = (wsId: string) => {
    if (wsId === 'all') return tasks.length;
    return tasks.filter((t) => t.workspaceId === wsId).length;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validation = validateWorkspaceForm(name);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid workspace name');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateWorkspace(name, color, description);
      setName('');
      setDescription('');
      setColor('#6366f1');
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Workspace List Tabs */}
        <div className="flex items-center gap-2 min-w-max">
          {/* All Workspaces Tab */}
          <button
            onClick={() => onSelectWorkspace('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeWorkspaceId === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>All Workspaces</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeWorkspaceId === 'all'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {getWorkspaceTaskCount('all')}
            </span>
          </button>

          {/* Individual Workspaces (Personal, Work, etc.) */}
          {workspaces.map((ws) => {
            const isActive = activeWorkspaceId === ws._id;
            const count = getWorkspaceTaskCount(ws._id);
            const isDefault = ws.slug === 'personal' || ws.slug === 'work';

            let IconComponent = Folder;
            if (ws.slug === 'personal') IconComponent = User;
            if (ws.slug === 'work') IconComponent = Briefcase;

            return (
              <div key={ws._id} className="relative group flex items-center">
                <button
                  onClick={() => onSelectWorkspace(ws._id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: ws.color || '#6366f1' }}
                  />
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span>{ws.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                {!isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete workspace "${ws.name}" and all its tasks?`)) {
                        onDeleteWorkspace(ws._id);
                      }
                    }}
                    title="Delete custom workspace"
                    className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] shadow-sm hover:scale-110 transition-transform"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Workspace Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 transition-all shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Space</span>
        </button>
      </div>

      {/* New Workspace Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Workspace"
        subtitle="Organize tasks into separate dedicated spaces"
        maxWidth="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Workspace Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Freelance Projects, Side Hustle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief description of this space"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
