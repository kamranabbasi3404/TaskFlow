'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Workspace,
  Task,
  Activity,
  TaskFormData,
  TaskFilterOptions,
  TaskStatus,
} from '@/types';
import {
  getLocalWorkspaces,
  saveLocalWorkspaces,
  getLocalTasks,
  saveLocalTasks,
  getLocalActivities,
  saveLocalActivities,
  addLocalActivity,
  DEFAULT_WORKSPACES,
  DEFAULT_TASKS,
  DEFAULT_ACTIVITIES,
} from '@/lib/storage';
import { filterAndSortTasks } from '@/lib/utils';
import { Header } from '@/components/navbar/Header';
import { WorkspaceSelector } from '@/components/navbar/WorkspaceSelector';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar';
import { TaskKanbanBoard } from '@/components/tasks/TaskKanbanBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { TaskModal } from '@/components/tasks/TaskModal';
import { ActivitySidebar } from '@/components/activity/ActivitySidebar';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('all');
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filter & View Options State
  const [filterOptions, setFilterOptions] = useState<TaskFilterOptions>({
    search: '',
    status: 'All',
    priority: 'All',
    sortBy: 'dueDateAsc',
    viewMode: 'kanban',
  });

  // UI Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatusPreset, setDefaultStatusPreset] = useState<TaskStatus>('To Do');
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);

  // Toast notification helper
  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Data Fetching (API with LocalStorage sync)
  const loadData = async () => {
    try {
      // 1. Fetch Workspaces from MongoDB API
      const wsRes = await fetch('/api/workspaces');
      if (wsRes.ok) {
        const wsData = await wsRes.json();
        if (wsData.offline) {
          setIsApiAvailable(false);
          setWorkspaces(getLocalWorkspaces());
          setTasks(getLocalTasks());
          setActivities(getLocalActivities());
          return;
        }
        if (wsData.success && wsData.data) {
          setWorkspaces(wsData.data);
          saveLocalWorkspaces(wsData.data);
          setIsApiAvailable(true);
        }
      }

      // 2. Fetch Tasks from MongoDB API
      const taskRes = await fetch('/api/tasks');
      if (taskRes.ok) {
        const tData = await taskRes.json();
        if (tData.success && tData.data) {
          setTasks(tData.data);
          saveLocalTasks(tData.data);
        }
      }

      // 3. Fetch Activities from MongoDB API
      const actRes = await fetch('/api/activities?limit=10');
      if (actRes.ok) {
        const aData = await actRes.json();
        if (aData.success && aData.data) {
          setActivities(aData.data);
          saveLocalActivities(aData.data);
        }
      }
    } catch {
      // Fallback to LocalStorage if network disconnected
      setIsApiAvailable(false);
      setWorkspaces(getLocalWorkspaces());
      setTasks(getLocalTasks());
      setActivities(getLocalActivities());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to log user action in UI & Storage
  const logUserAction = async (
    action: Activity['action'],
    taskTitle?: string,
    workspaceName?: string,
    customMessage?: string
  ) => {
    const newAct = addLocalActivity(action, taskTitle, workspaceName, customMessage);
    setActivities((prev) => [newAct, ...prev]);

    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAct),
      });
    } catch {}
  };

  // Seed / Reset Demo Data Handler
  const handleSeedData = async () => {
    setIsSeeding(true);
    saveLocalWorkspaces(DEFAULT_WORKSPACES);
    saveLocalTasks([]);
    saveLocalActivities([]);
    setTasks([]);
    setActivities([]);
    setWorkspaces(DEFAULT_WORKSPACES);

    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Tasks cleared and database reset!', 'success');
          setIsSeeding(false);
          return;
        }
      }
    } catch {}

    showToast('Tasks cleared and reset locally!', 'success');
    setIsSeeding(false);
  };

  // Workspace Operations
  const handleCreateWorkspace = async (
    name: string,
    color: string,
    description: string
  ) => {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const newWs: Workspace = {
      _id: 'ws-' + Date.now(),
      name: name.trim(),
      slug,
      color: color || '#6366f1',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color, description }),
      });
      const data = await res.json();
      if (data.success && data.data && !data.offline) {
        setWorkspaces((prev) => [...prev, data.data]);
        setActiveWorkspaceId(data.data._id);
        saveLocalWorkspaces([...workspaces, data.data]);
        showToast(`Workspace "${name}" saved to MongoDB Atlas!`, 'success');
        return;
      }
    } catch {}

    // Local fallback
    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    saveLocalWorkspaces(updated);
    setActiveWorkspaceId(newWs._id);
    logUserAction('workspace_created', undefined, newWs.name);
    showToast(`Workspace "${name}" created`, 'success');
  };

  const handleDeleteWorkspace = async (id: string) => {
    const ws = workspaces.find((w) => w._id === id);
    if (!ws) return;

    try {
      await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
    } catch {}

    const updatedWs = workspaces.filter((w) => w._id !== id);
    const updatedT = tasks.filter((t) => t.workspaceId !== id);
    setWorkspaces(updatedWs);
    setTasks(updatedT);
    saveLocalWorkspaces(updatedWs);
    saveLocalTasks(updatedT);

    if (activeWorkspaceId === id) {
      setActiveWorkspaceId('all');
    }

    logUserAction('workspace_deleted', undefined, ws.name);
    showToast(`Workspace "${ws.name}" deleted`, 'info');
  };

  // Task Operations (Create, Update, Delete, Status Change)
  const handleSaveTask = async (formData: TaskFormData, taskId?: string) => {
    const ws = workspaces.find((w) => w._id === formData.workspaceId);
    const workspaceName = ws ? ws.name : '';

    if (taskId) {
      // Update Task
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data && !data.offline) {
          const updated = tasks.map((t) => (t._id === taskId ? data.data : t));
          setTasks(updated);
          saveLocalTasks(updated);
          showToast(`Task "${formData.title}" updated in MongoDB!`, 'success');
          return;
        }
      } catch {}

      // Local fallback
      const updated = tasks.map((t) =>
        t._id === taskId
          ? {
              ...t,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : t
      );
      setTasks(updated);
      saveLocalTasks(updated);
      logUserAction('task_updated', formData.title, workspaceName);
      showToast(`Task "${formData.title}" updated`, 'success');
    } else {
      // Create Task
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.data && !data.offline) {
          const updated = [data.data, ...tasks];
          setTasks(updated);
          saveLocalTasks(updated);
          showToast(`Task "${formData.title}" saved to MongoDB Atlas!`, 'success');
          return;
        }
      } catch {}

      // Local fallback
      const newTask: Task = {
        _id: 'task-' + Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveLocalTasks(updated);
      logUserAction('task_created', formData.title, workspaceName);
      showToast(`Task "${formData.title}" created`, 'success');
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t._id === id);
    if (!task || task.status === newStatus) return;

    // Optimistic UI Update
    const updatedTasks = tasks.map((t) =>
      t._id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);

    const logMsg = `Task "${task.title}" marked as ${newStatus}`;
    logUserAction('task_status_changed', task.title, undefined, logMsg);
    showToast(logMsg, 'info');

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  const handleDeleteTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const updatedTasks = tasks.filter((t) => t._id !== id);
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);

    logUserAction('task_deleted', task.title);
    showToast(`Task "${task.title}" deleted`, 'info');
    setDeleteConfirmTaskId(null);

    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Filter & Workspace Task Filtering Logic
  const workspaceFilteredTasks = useMemo(() => {
    if (activeWorkspaceId === 'all') return tasks;
    return tasks.filter((t) => t.workspaceId === activeWorkspaceId);
  }, [tasks, activeWorkspaceId]);

  const displayedTasks = useMemo(() => {
    return filterAndSortTasks(workspaceFilteredTasks, filterOptions);
  }, [workspaceFilteredTasks, filterOptions]);

  const openCreateModal = (statusPreset: TaskStatus = 'To Do') => {
    setTaskToEdit(null);
    setDefaultStatusPreset(statusPreset);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header Navbar */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenActivityDrawer={() => setIsActivityDrawerOpen(true)}
        onOpenTaskModal={() => openCreateModal('To Do')}
        onSeedData={handleSeedData}
        activityCount={activities.length}
        isSeeding={isSeeding}
      />

      {/* Workspace Switcher Bar */}
      <WorkspaceSelector
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={setActiveWorkspaceId}
        onCreateWorkspace={handleCreateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        tasks={tasks}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics Summary Cards */}
        <TaskStats tasks={workspaceFilteredTasks} />

        {/* Search, Dual Filters, Sort & View Mode Toolbar */}
        <TaskFilterBar
          filterOptions={filterOptions}
          onFilterChange={(newOpts) => setFilterOptions({ ...filterOptions, ...newOpts })}
          totalResults={displayedTasks.length}
        />

        {/* View Switcher: Kanban Board (Drag & Drop) vs List / Grid */}
        {filterOptions.viewMode === 'kanban' ? (
          <TaskKanbanBoard
            tasks={displayedTasks}
            workspaces={workspaces}
            onEdit={openEditModal}
            onDelete={(id) => setDeleteConfirmTaskId(id)}
            onStatusChange={handleStatusChange}
            onAddNewTask={(status) => openCreateModal(status || 'To Do')}
          />
        ) : (
          <TaskListView
            tasks={displayedTasks}
            workspaces={workspaces}
            onEdit={openEditModal}
            onDelete={(id) => setDeleteConfirmTaskId(id)}
            onStatusChange={handleStatusChange}
            viewMode={filterOptions.viewMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        TaskFlow App &bull; Connected to MongoDB Atlas &bull; Next.js 14, TypeScript & Tailwind CSS
      </footer>

      {/* Task Form Modal (Create / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        defaultStatusPreset={defaultStatusPreset}
      />

      {/* Recent Activity Log Sidebar Drawer */}
      <ActivitySidebar
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        activities={activities}
        onClearActivities={() => {
          setActivities([]);
          saveLocalActivities([]);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmTaskId !== null}
        onClose={() => setDeleteConfirmTaskId(null)}
        onConfirm={() => deleteConfirmTaskId && handleDeleteTask(deleteConfirmTaskId)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
