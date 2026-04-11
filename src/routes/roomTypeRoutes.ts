import { Router } from 'express';
import {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
  getActiveRoomTypes,
  toggleRoomTypeStatus,
} from '../controllers/roomTypeController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRoomTypeSchema, updateRoomTypeSchema, paginationSchema } from '../validators/roomType.validator';

const router = Router();

// Protected room type routes with validation

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Get all room types with pagination
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for room type names
 *     responses:
 *       200:
 *         description: List of room types retrieved successfully
 */
router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllRoomTypes);

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create a new room type
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - branchId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Room type name (e.g., Single, Double, Suite)
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Room type description
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch this room type belongs to
 *     responses:
 *       201:
 *         description: Room type created successfully
 */
router.post('/', authenticateToken, validate(createRoomTypeSchema, 'body'), createRoomType);

/**
 * @swagger
 * /api/room-types/all:
 *   get:
 *     summary: Get all active room types for dropdowns
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active room types retrieved successfully
 */
router.get('/all', authenticateToken, getActiveRoomTypes);

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get a room type by ID
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Room type retrieved successfully
 */
router.get('/:id', authenticateToken, getRoomTypeById);

/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     summary: Update a room type
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Room type name
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Room type description
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch (optional, if changing branch)
 *               isActive:
 *                 type: boolean
 *                 description: Whether the room type is active
 *     responses:
 *       200:
 *         description: Room type updated successfully
 */
router.put('/:id', authenticateToken, validate(updateRoomTypeSchema, 'body'), updateRoomType);

/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     summary: Delete a room type
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 */
router.delete('/:id', authenticateToken, deleteRoomType);

/**
 * @swagger
 * /api/room-types/{id}/change-status:
 *   put:
 *     summary: Toggle room type status (activate if inactive, deactivate if active)
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Room type status toggled successfully
 *       404:
 *         description: Room type not found
 */
router.put('/:id/change-status', authenticateToken, toggleRoomTypeStatus);

export default router;
