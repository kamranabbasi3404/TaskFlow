import { describe, it, expect } from 'vitest';
import { validateTaskForm, validateWorkspaceForm } from '../src/lib/validation';

describe('Task & Workspace Form Validation', () => {
  it('should return invalid when title is empty or whitespace', () => {
    const res = validateTaskForm({
      title: '   ',
      workspaceId: 'ws-1',
      dueDate: '2026-12-31',
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBe('Task title is required.');
  });

  it('should return invalid when workspace is missing', () => {
    const res = validateTaskForm({
      title: 'Buy Groceries',
      workspaceId: '',
      dueDate: '2026-12-31',
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.workspaceId).toBe('Please select a workspace.');
  });

  it('should reject due dates in the past', () => {
    const res = validateTaskForm({
      title: 'Past Task',
      workspaceId: 'ws-1',
      dueDate: '2020-01-01',
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.dueDate).toBe('Due date cannot be in the past.');
  });

  it('should pass validation with valid data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const res = validateTaskForm({
      title: 'Valid Task Name',
      workspaceId: 'ws-1',
      dueDate: tomorrow.toISOString().split('T')[0],
    });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toEqual(0);
  });

  it('should validate workspace name', () => {
    expect(validateWorkspaceForm('').isValid).toBe(false);
    expect(validateWorkspaceForm('  ').isValid).toBe(false);
    expect(validateWorkspaceForm('Side Projects').isValid).toBe(true);
  });
});
