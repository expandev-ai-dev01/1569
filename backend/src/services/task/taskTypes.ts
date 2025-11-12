/**
 * @summary
 * Type definitions for task management
 *
 * @module services/task/taskTypes
 *
 * @description
 * Defines TypeScript interfaces and types for task entities,
 * requests, and responses.
 */

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

/**
 * @enum RecurrenceType
 * @description Task recurrence types
 */
export enum RecurrenceType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}

/**
 * @interface TaskEntity
 * @description Task database entity
 *
 * @property {number} idTask - Task identifier
 * @property {number} idAccount - Account identifier
 * @property {number} idUserCreator - Creator user identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {TaskPriority} priority - Task priority
 * @property {TaskStatus} status - Task status
 * @property {Date | null} dueDate - Due date
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUserCreator: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface TaskRecurrenceConfig
 * @description Task recurrence configuration
 *
 * @property {RecurrenceType} recurrenceType - Recurrence type
 * @property {number} interval - Recurrence interval
 * @property {string | null} weekDays - Week days for weekly recurrence
 * @property {number | null} monthDay - Month day for monthly recurrence
 * @property {Date} startDate - Recurrence start date
 * @property {Date | null} endDate - Recurrence end date
 * @property {number | null} occurrenceCount - Number of occurrences
 */
export interface TaskRecurrenceConfig {
  recurrenceType: RecurrenceType;
  interval: number;
  weekDays?: string | null;
  monthDay?: number | null;
  startDate: Date;
  endDate?: Date | null;
  occurrenceCount?: number | null;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for task creation
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {TaskPriority} priority - Task priority
 * @property {Date | null} dueDate - Due date
 * @property {number[]} assignedUsers - Assigned user IDs
 * @property {TaskRecurrenceConfig | null} recurrence - Recurrence configuration
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  assignedUsers: number[];
  recurrence: TaskRecurrenceConfig | null;
}

/**
 * @interface TaskCreateResponse
 * @description Response from task creation
 *
 * @property {number} idTask - Created task identifier
 */
export interface TaskCreateResponse {
  idTask: number;
}
