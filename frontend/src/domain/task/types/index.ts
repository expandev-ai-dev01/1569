export interface Task {
  idTask: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  createdBy: number;
  assignedUsers: number[];
  recurrence: TaskRecurrence | null;
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

export enum RecurrenceType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}

export interface TaskRecurrence {
  recurrenceType: RecurrenceType;
  interval: number;
  weekDays?: string;
  monthDay?: number;
  startDate: Date;
  endDate?: Date;
  occurrenceCount?: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date | null;
  assignedUsers?: number[];
  recurrence?: TaskRecurrence | null;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedUsers?: number[];
  hasRecurrence: boolean;
  recurrenceType?: RecurrenceType;
  interval?: number;
  weekDays?: string;
  monthDay?: number;
  startDate?: string;
  endDate?: string;
  occurrenceCount?: number;
}
