import { TaskFormData, FormErrorState } from '@/types';

export function validateTaskForm(data: Partial<TaskFormData>): {
  isValid: boolean;
  errors: FormErrorState;
} {
  const errors: FormErrorState = {};

  // Title validation
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Task title is required.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Task title cannot exceed 120 characters.';
  }

  // Workspace validation
  if (!data.workspaceId || data.workspaceId.trim() === '') {
    errors.workspaceId = 'Please select a workspace.';
  }

  // Due Date validation
  if (!data.dueDate || data.dueDate.trim() === '') {
    errors.dueDate = 'Due date is required.';
  } else {
    const selectedDate = new Date(data.dueDate);
    if (isNaN(selectedDate.getTime())) {
      errors.dueDate = 'Please enter a valid date.';
    } else {
      // Check if due date is in the past (before start of today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const targetDate = new Date(selectedDate);
      targetDate.setHours(0, 0, 0, 0);

      if (targetDate < today) {
        errors.dueDate = 'Due date cannot be in the past.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateWorkspaceForm(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Workspace name is required.' };
  }
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Workspace name cannot exceed 50 characters.' };
  }
  return { isValid: true };
}
