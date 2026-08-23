import { Workspace, Task, Activity, TaskFormData } from '@/types';
import { createActivityPayload } from './utils';

const WORKSPACES_STORAGE_KEY = 'trickleup_workspaces_v1';
const TASKS_STORAGE_KEY = 'trickleup_tasks_v1';
const ACTIVITIES_STORAGE_KEY = 'trickleup_activities_v1';

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    _id: 'ws-personal',
    name: 'Personal',
    slug: 'personal',
    color: '#3b82f6', // Blue
    description: 'Personal projects, daily goals, and tasks',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'ws-work',
    name: 'Work',
    slug: 'work',
    color: '#8b5cf6', // Purple
    description: 'Professional assignments, sprint tasks, and client work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_TASKS: Task[] = [];

export const DEFAULT_ACTIVITIES: Activity[] = [];

// Helper functions for LocalStorage persistence
export function getLocalWorkspaces(): Workspace[] {
  if (typeof window === 'undefined') return DEFAULT_WORKSPACES;
  const data = localStorage.getItem(WORKSPACES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(DEFAULT_WORKSPACES));
    return DEFAULT_WORKSPACES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_WORKSPACES;
  }
}

export function saveLocalWorkspaces(workspaces: Workspace[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
  }
}

export function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalTasks(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }
}

export function getLocalActivities(): Activity[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalActivities(activities: Activity[]): void {
  if (typeof window !== 'undefined') {
    const trimmed = activities.slice(0, 50);
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function addLocalActivity(
  action: Activity['action'],
  taskTitle?: string,
  workspaceName?: string,
  customMessage?: string
): Activity {
  const current = getLocalActivities();
  const payload = createActivityPayload(action, taskTitle, workspaceName, customMessage);
  const newActivity: Activity = {
    _id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    ...payload,
  };
  const updated = [newActivity, ...current];
  saveLocalActivities(updated);
  return newActivity;
}
