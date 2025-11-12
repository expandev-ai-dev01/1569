import type { CreateTaskDto, Task } from '../../types';

export interface UseTaskCreateOptions {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}

export interface UseTaskCreateReturn {
  createTask: (data: CreateTaskDto) => Promise<Task>;
  isCreating: boolean;
  error: Error | null;
}
