/**
 * @summary
 * Task API controller
 *
 * @module api/v1/internal/task/controller
 *
 * @description
 * Handles HTTP requests for task management operations.
 * Implements task creation with validation and error handling.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, TaskCreateRequest } from '@/services/task';

const securable = 'TASK';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with title, description, priority, due date, and optional assignments
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {Number} priority Priority level (0=Low, 1=Medium, 2=High)
 * @apiParam {Date} [dueDate] Due date (ISO format)
 * @apiParam {Number[]} [assignedUsers] Array of user IDs (max 5)
 * @apiParam {Object} [recurrence] Recurrence configuration
 * @apiParam {Number} [recurrence.recurrenceType] Recurrence type (0=Daily, 1=Weekly, 2=Monthly, 3=Yearly)
 * @apiParam {Number} [recurrence.interval] Recurrence interval (min 1)
 * @apiParam {String} [recurrence.weekDays] Comma-separated week days (0-6) for weekly recurrence
 * @apiParam {Number} [recurrence.monthDay] Day of month for monthly recurrence (1-31 or -1)
 * @apiParam {Date} [recurrence.startDate] Recurrence start date
 * @apiParam {Date} [recurrence.endDate] Recurrence end date
 * @apiParam {Number} [recurrence.occurrenceCount] Number of occurrences (1-100)
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleTooShort Title must be at least 3 characters
 * @apiError {String} titleTooLong Title must be at most 100 characters
 * @apiError {String} descriptionTooLong Description must be at most 1000 characters
 * @apiError {String} invalidPriority Priority must be 0, 1, or 2
 * @apiError {String} dueDateInPast Due date cannot be in the past
 * @apiError {String} tooManyAssignedUsers Maximum 5 assigned users allowed
 * @apiError {String} invalidRecurrenceConfiguration Invalid recurrence configuration
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const recurrenceSchema = z
    .object({
      recurrenceType: z.number().int().min(0).max(3),
      interval: z.number().int().min(1),
      weekDays: z.string().max(20).nullable().optional(),
      monthDay: z.number().int().min(-1).max(31).nullable().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().nullable().optional(),
      occurrenceCount: z.number().int().min(1).max(100).nullable().optional(),
    })
    .nullable()
    .optional();

  const bodySchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(1000).optional().default(''),
    priority: z.number().int().min(0).max(2).default(1),
    dueDate: z.coerce.date().nullable().optional(),
    assignedUsers: z.array(z.number().int().positive()).max(5).optional().default([]),
    recurrence: recurrenceSchema,
  });

  type TaskCreateBody = z.infer<typeof bodySchema>;

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated as {
      credential: { idAccount: number; idUser: number };
      params: TaskCreateBody;
    };

    const requestParams: TaskCreateRequest = {
      idAccount: data.credential.idAccount,
      idUser: data.credential.idUser,
      title: data.params.title,
      description: data.params.description,
      priority: data.params.priority,
      dueDate: data.params.dueDate || null,
      assignedUsers: data.params.assignedUsers,
      recurrence: data.params.recurrence || null,
    };

    const result = await taskCreate(requestParams);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
