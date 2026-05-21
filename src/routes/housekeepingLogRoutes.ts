import { Router } from 'express';
import {
  createHousekeepingLog,
  getAllHousekeepingLogs,
  getHousekeepingLogById,
  updateHousekeepingLog,
  deleteHousekeepingLog,
} from '../controllers/housekeepingLogController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createHousekeepingLogSchema,
  updateHousekeepingLogSchema,
  paginationSchema,
} from '../validators/housekeepingLog.validator';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Housekeeping
 *   description: Housekeeping log management
 */

/**
 * @swagger
 * /api/housekeeping:
 *   get:
 *     summary: Get all housekeeping logs
 *     tags: [Housekeeping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of housekeeping logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/api/housekeepingLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/housekeeping:
 *   post:
 *     summary: Create a housekeeping log
 *     tags: [Housekeeping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHousekeepingLog'
 *     responses:
 *       201:
 *         description: Housekeeping log created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/api/housekeepingLog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/housekeeping/{id}:
 *   get:
 *     summary: Get housekeeping log by ID
 *     tags: [Housekeeping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Housekeeping log ID
 *     responses:
 *       200:
 *         description: Housekeeping log details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/api/housekeepingLog'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/housekeeping/{id}:
 *   put:
 *     summary: Update housekeeping log
 *     tags: [Housekeeping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Housekeeping log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHousekeepingLog'
 *     responses:
 *       200:
 *         description: Housekeeping log updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/api/housekeepingLog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/housekeeping/{id}:
 *   delete:
 *     summary: Delete housekeeping log
 *     tags: [Housekeeping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Housekeeping log ID
 *     responses:
 *       200:
 *         description: Housekeeping log deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HousekeepingLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         roomId:
 *           type: string
 *           format: uuid
 *         staffId:
 *           type: string
 *           format: uuid
 *         branchId:
 *           type: string
 *           format: uuid
 *         shift:
 *           type: string
 *           maxLength: 50
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         assignedAt:
 *           type: string
 *           format: date-time
 *         startTime:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateHousekeepingLog:
 *       type: object
 *       required:
 *         - roomId
 *         - staffId
 *         - branchId
 *         - status
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         staffId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         branchId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *         shift:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "morning"
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *           example: "pending"
 *         assignedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T08:00:00Z"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T09:00:00Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T10:00:00Z"
 *         notes:
 *           type: string
 *           example: "Room needs extra cleaning"
 *
 *     UpdateHousekeepingLog:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         staffId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         branchId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *         shift:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "evening"
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *           example: "in_progress"
 *         assignedAt:
 *           type: string
 *           format: date-time
 *         startTime:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           example: "Updated cleaning notes"
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Not found
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Validation error
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     message:
 *                       type: string
 */

router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllHousekeepingLogs);
router.post('/', authenticateToken, validate(createHousekeepingLogSchema, 'body'), createHousekeepingLog);
router.get('/:id', authenticateToken, getHousekeepingLogById);
router.put('/:id', authenticateToken, validate(updateHousekeepingLogSchema, 'body'), updateHousekeepingLog);
router.delete('/:id', authenticateToken, deleteHousekeepingLog);

export default router;
