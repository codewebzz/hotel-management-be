import { Router } from 'express';
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getActiveRooms,
  toggleRoomStatus,
} from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createRoomSchema,
  updateRoomSchema,
  paginationSchema,
} from '../validators/room.validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         roomNumber:
 *           type: string
 *           description: Room number or identifier
 *         roomTypeId:
 *           type: string
 *           format: uuid
 *           description: ID of the room type
 *         floor:
 *           type: integer
 *           nullable: true
 *           description: Floor number
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional notes about the room
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: ID of the company
 *         brandId:
 *           type: string
 *           format: uuid
 *           description: ID of the brand
 *         branchId:
 *           type: string
 *           format: uuid
 *           description: ID of the branch
 *         isActive:
 *           type: boolean
 *           description: Whether the room is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RoomPaginationInfo:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *         totalPages:
 *           type: number
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms with pagination
 *     tags:
 *       - Rooms
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
 *         description: Search query for room numbers
 *     responses:
 *       200:
 *         description: List of rooms retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 */
router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomNumber
 *               - roomTypeId
 *               - companyId
 *               - brandId
 *               - branchId
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 description: Room number or identifier
 *               roomTypeId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the room type
 *               floor:
 *                 type: integer
 *                 nullable: true
 *                 description: Floor number
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Additional notes about the room
 *               companyId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the company
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the brand
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch
 *     responses:
 *       201:
 *         description: Room created successfully
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
 *                   $ref: '#/components/schemas/Room'
 */
router.post('/', authenticateToken, validate(createRoomSchema, 'body'), createRoom);

/**
 * @swagger
 * /api/rooms/all:
 *   get:
 *     summary: Get all active rooms for dropdowns
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active rooms retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 */
router.get('/all', authenticateToken, getActiveRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags:
 *       - Rooms
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
 *         description: Room retrieved successfully
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
 *                   $ref: '#/components/schemas/Room'
 */
router.get('/:id', authenticateToken, getRoomById);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags:
 *       - Rooms
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
 *               roomNumber:
 *                 type: string
 *                 description: Room number or identifier
 *               roomTypeId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the room type
 *               floor:
 *                 type: integer
 *                 nullable: true
 *                 description: Floor number
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Additional notes about the room
 *               companyId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the company
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the brand
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch
 *               isActive:
 *                 type: boolean
 *                 description: Whether the room is active
 *     responses:
 *       200:
 *         description: Room updated successfully
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
 *                   $ref: '#/components/schemas/Room'
 */
router.put(
  '/:id',
  authenticateToken,
  validate(updateRoomSchema, 'body'),
  updateRoom
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Rooms
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
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/:id', authenticateToken, deleteRoom);

/**
 * @swagger
 * /api/rooms/{id}/change-status:
 *   put:
 *     summary: Toggle room status (activate if inactive, deactivate if active)
 *     tags:
 *       - Rooms
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
 *         description: Room status toggled successfully
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
 *                   $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 */
router.put('/:id/change-status', authenticateToken, toggleRoomStatus);

export default router;
