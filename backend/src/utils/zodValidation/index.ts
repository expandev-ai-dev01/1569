/**
 * @summary
 * Zod validation utilities and reusable schemas
 *
 * @module utils/zodValidation
 *
 * @description
 * Provides reusable Zod validation schemas and utilities for consistent
 * data validation across the application.
 */

import { z } from 'zod';

/**
 * @summary String validation with max length
 */
export const zString = z.string().min(1);

/**
 * @summary Nullable string with max length
 */
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

/**
 * @summary Name field validation (1-200 characters)
 */
export const zName = z.string().min(1).max(200);

/**
 * @summary Description field validation (max 500 characters, nullable)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @summary Foreign key validation (positive integer, nullable)
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * @summary Foreign key validation (positive integer, required)
 */
export const zFK = z.number().int().positive();

/**
 * @summary BIT field validation (0 or 1)
 */
export const zBit = z.number().int().min(0).max(1);

/**
 * @summary Date string validation (ISO format)
 */
export const zDateString = z.string().datetime();

/**
 * @summary Email validation
 */
export const zEmail = z.string().email();

/**
 * @summary Password validation (min 8 characters)
 */
export const zPassword = z.string().min(8);
