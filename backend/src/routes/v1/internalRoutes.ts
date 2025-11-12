/**
 * @summary
 * Internal (authenticated) API routes configuration
 *
 * @module routes/v1/internalRoutes
 *
 * @description
 * Defines all authenticated API endpoints that require user authentication.
 * All routes in this module should include authentication middleware.
 */

import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);

export default router;
