import { Task, TaskFilterOptions, Activity, ActivityAction } from '@/types';

export function filterAndSortTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
  let result = [...tasks];

  // 1. Search filter (by title or description)
  if (options.search && options.search.trim() !== '') {
    const query = options.search.toLowerCase().trim();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }

  // 2. Status filter
  if (options.status && options.status !== 'All') {
    result = result.filter((task) => task.status === options.status);
  }

  // 3. Priority filter
  if (options.priority && options.priority !== 'All') {
    result = result.filter((task) => task.priority === options.priority);
  }

  // 4. Sorting logic
  result.sort((a, b) => {
    if (options.sortBy === 'dueDateAsc') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (options.sortBy === 'dueDateDesc') {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    if (options.sortBy === 'priority') {
      const priorityMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
    }
    if (options.sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return result;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeAgo(timestampStr: string): string {
  if (!timestampStr) return '';
  const time = new Date(timestampStr).getTime();
  if (isNaN(time)) return '';

  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function createActivityPayload(
  action: ActivityAction,
  taskTitle?: string,
  workspaceName?: string,
  customMessage?: string
): Omit<Activity, '_id'> {
  let message = customMessage || '';

  if (!customMessage) {
    switch (action) {
      case 'task_created':
        message = `Task "${taskTitle}" created`;
        break;
      case 'task_updated':
        message = `Task "${taskTitle}" updated`;
        break;
      case 'task_status_changed':
        message = `Task "${taskTitle}" status changed`;
        break;
      case 'task_deleted':
        message = `Task "${taskTitle}" deleted`;
        break;
      case 'workspace_created':
        message = `Workspace "${workspaceName}" created`;
        break;
      case 'workspace_deleted':
        message = `Workspace "${workspaceName}" deleted`;
        break;
    }
  }

  return {
    action,
    message,
    taskTitle,
    workspaceName,
    timestamp: new Date().toISOString(),
  };
}
