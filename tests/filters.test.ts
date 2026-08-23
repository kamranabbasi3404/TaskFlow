import { describe, it, expect } from 'vitest';
import { filterAndSortTasks } from '../src/lib/utils';
import { Task } from '../src/types';

const sampleTasks: Task[] = [
  {
    _id: '1',
    workspaceId: 'ws-personal',
    title: 'Fix Bug in Dashboard',
    description: 'Resolve state refresh issue',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-08-25',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    _id: '2',
    workspaceId: 'ws-work',
    title: 'Design Wireframes',
    description: 'Create mobile UI layouts',
    priority: 'Low',
    status: 'To Do',
    dueDate: '2026-08-22',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
  },
  {
    _id: '3',
    workspaceId: 'ws-work',
    title: 'Write Documentation',
    description: 'Document API endpoints',
    priority: 'High',
    status: 'Done',
    dueDate: '2026-08-30',
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-03T10:00:00Z',
  },
];

describe('Task Filtering and Sorting Logic', () => {
  it('should search tasks by title substring', () => {
    const res = filterAndSortTasks(sampleTasks, {
      search: 'Wireframes',
      status: 'All',
      priority: 'All',
      sortBy: 'dueDateAsc',
      viewMode: 'kanban',
    });
    expect(res.length).toBe(1);
    expect(res[0].title).toBe('Design Wireframes');
  });

  it('should filter by status AND priority simultaneously', () => {
    const res = filterAndSortTasks(sampleTasks, {
      search: '',
      status: 'Done',
      priority: 'High',
      sortBy: 'dueDateAsc',
      viewMode: 'kanban',
    });
    expect(res.length).toBe(1);
    expect(res[0].title).toBe('Write Documentation');
  });

  it('should sort tasks by due date ascending (soonest first)', () => {
    const res = filterAndSortTasks(sampleTasks, {
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'dueDateAsc',
      viewMode: 'kanban',
    });
    expect(res[0].dueDate).toBe('2026-08-22');
    expect(res[1].dueDate).toBe('2026-08-25');
    expect(res[2].dueDate).toBe('2026-08-30');
  });
});
