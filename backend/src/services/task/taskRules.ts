/**
 * @summary
 * Task business logic and database operations
 *
 * @module services/task/taskRules
 *
 * @description
 * Implements task creation, validation, and database interaction logic.
 * Handles task assignments, recurrence configuration, and data transformation.
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import { TaskCreateRequest, TaskCreateResponse, TaskRecurrenceConfig } from './taskTypes';

/**
 * @summary
 * Creates a new task with optional assignments and recurrence
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string} params.description - Task description
 * @param {number} params.priority - Task priority (0=Low, 1=Medium, 2=High)
 * @param {Date | null} params.dueDate - Due date
 * @param {number[]} params.assignedUsers - Assigned user IDs
 * @param {TaskRecurrenceConfig | null} params.recurrence - Recurrence configuration
 *
 * @returns {Promise<TaskCreateResponse>} Created task identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const task = await taskCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   title: 'Complete project documentation',
 *   description: 'Write comprehensive documentation for the project',
 *   priority: 2,
 *   dueDate: new Date('2024-12-31'),
 *   assignedUsers: [2, 3],
 *   recurrence: null
 * });
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskCreateResponse> {
  const dbParams: any = {
    idAccount: params.idAccount,
    idUser: params.idUser,
    title: params.title,
    description: params.description || '',
    priority: params.priority,
    dueDate: params.dueDate,
    assignedUsers:
      params.assignedUsers && params.assignedUsers.length > 0
        ? JSON.stringify(params.assignedUsers)
        : null,
    recurrenceType: params.recurrence?.recurrenceType ?? null,
    recurrenceInterval: params.recurrence?.interval ?? null,
    recurrenceWeekDays: params.recurrence?.weekDays ?? null,
    recurrenceMonthDay: params.recurrence?.monthDay ?? null,
    recurrenceStartDate: params.recurrence?.startDate ?? null,
    recurrenceEndDate: params.recurrence?.endDate ?? null,
    recurrenceOccurrenceCount: params.recurrence?.occurrenceCount ?? null,
  };

  const result = await dbRequest('[functional].[spTaskCreate]', dbParams, ExpectedReturn.Single);

  return result as TaskCreateResponse;
}
