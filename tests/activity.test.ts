import { describe, it, expect } from 'vitest';
import { createActivityPayload } from '../src/lib/utils';

describe('Activity Logger', () => {
  it('should format task creation activity message correctly', () => {
    const payload = createActivityPayload('task_created', 'Refactor API', 'Work');
    expect(payload.message).toBe('Task "Refactor API" created');
    expect(payload.taskTitle).toBe('Refactor API');
    expect(payload.workspaceName).toBe('Work');
  });

  it('should format status change action message correctly', () => {
    const payload = createActivityPayload('task_status_changed', 'Setup MongoDB');
    expect(payload.message).toBe('Task "Setup MongoDB" status changed');
  });
});
