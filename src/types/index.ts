export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  workspaceId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

export type ActivityAction =
  | 'task_created'
  | 'task_updated'
  | 'task_status_changed'
  | 'task_deleted'
  | 'workspace_created'
  | 'workspace_deleted';

export interface Activity {
  _id: string;
  action: ActivityAction;
  message: string;
  taskTitle?: string;
  workspaceName?: string;
  timestamp: string;
}

export interface TaskFormData {
  workspaceId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskFilterOptions {
  search: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  sortBy: 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'createdAt';
  viewMode: 'kanban' | 'list' | 'grid';
}

export interface FormErrorState {
  title?: string;
  workspaceId?: string;
  dueDate?: string;
  general?: string;
}
