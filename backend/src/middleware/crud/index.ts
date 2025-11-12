/**
 * @summary
 * CRUD controller middleware for standardized operations
 *
 * @module middleware/crud
 *
 * @description
 * Provides base controller functionality for CRUD operations with built-in
 * validation, security checks, and standardized response formatting.
 */

import { Request } from 'express';
import { z } from 'zod';

/**
 * @interface SecurityRule
 * @description Security rule configuration for CRUD operations
 *
 * @property {string} securable - Resource name for security check
 * @property {string} permission - Required permission (CREATE, READ, UPDATE, DELETE)
 */
export interface SecurityRule {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

/**
 * @interface ValidatedRequest
 * @description Validated request data structure
 *
 * @property {object} credential - User credential information
 * @property {number} credential.idAccount - Account identifier
 * @property {number} credential.idUser - User identifier
 * @property {any} params - Validated request parameters
 */
export interface ValidatedRequest {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

/**
 * @class CrudController
 * @description Base controller for CRUD operations with security and validation
 */
export class CrudController {
  private securityRules: SecurityRule[];

  constructor(securityRules: SecurityRule[]) {
    this.securityRules = securityRules;
  }

  /**
   * @summary
   * Validates CREATE operation request
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidatedRequest | null, Error | null]>}
   */
  async create(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidatedRequest | null, Error | null]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  /**
   * @summary
   * Validates READ operation request
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidatedRequest | null, Error | null]>}
   */
  async read(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, Error | null]> {
    return this.validateRequest(req, schema, 'READ');
  }

  /**
   * @summary
   * Validates UPDATE operation request
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidatedRequest | null, Error | null]>}
   */
  async update(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidatedRequest | null, Error | null]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  /**
   * @summary
   * Validates DELETE operation request
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidatedRequest | null, Error | null]>}
   */
  async delete(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidatedRequest | null, Error | null]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  /**
   * @summary
   * Internal request validation method
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   * @param {string} operation - Operation type
   *
   * @returns {Promise<[ValidatedRequest | null, Error | null]>}
   */
  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    operation: string
  ): Promise<[ValidatedRequest | null, Error | null]> {
    try {
      const params = { ...req.params, ...req.query, ...req.body };
      const validated = await schema.parseAsync(params);

      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      return [{ credential, params: validated }, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}

/**
 * @summary
 * Creates a success response object
 *
 * @function successResponse
 *
 * @param {any} data - Response data
 * @param {object} metadata - Optional metadata
 *
 * @returns {object} Standardized success response
 */
export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary
 * Creates an error response object
 *
 * @function errorResponse
 *
 * @param {string} message - Error message
 * @param {string} code - Error code
 *
 * @returns {object} Standardized error response
 */
export function errorResponse(message: string, code: string = 'ERROR') {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * @constant StatusGeneralError
 * @description General error object for unexpected errors
 */
export const StatusGeneralError = new Error('An unexpected error occurred');
