export * from './components/TaskForm';
export * from './hooks/useTaskCreate';
export * from './services/taskService';
export * from './types';

export const moduleMetadata = {
  name: 'task',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['TaskForm'],
  publicHooks: ['useTaskCreate'],
  publicServices: ['taskService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/lib/queryClient'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'axios'],
    domains: [],
  },
  exports: {
    components: ['TaskForm'],
    hooks: ['useTaskCreate'],
    services: ['taskService'],
    types: [
      'Task',
      'TaskPriority',
      'TaskStatus',
      'RecurrenceType',
      'TaskRecurrence',
      'CreateTaskDto',
      'TaskFormData',
    ],
  },
} as const;
