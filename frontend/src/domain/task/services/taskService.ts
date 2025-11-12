import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto } from '../types';

export const taskService = {
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post('/task', data);
    return response.data.data;
  },
};
