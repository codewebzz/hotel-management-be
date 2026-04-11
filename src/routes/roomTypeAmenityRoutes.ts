import { Router } from 'express';
import {
  createRoomTypeAmenity,
  getAllRoomTypeAmenities,
  getRoomTypeAmenityById,
  updateRoomTypeAmenity,
  deleteRoomTypeAmenity,
  getActiveRoomTypeAmenities,
  toggleRoomTypeAmenityStatus,
} from '../controllers/roomTypeAmenityController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createRoomTypeAmenitySchema,
  updateRoomTypeAmenitySchema,
  paginationSchema,
} from '../validators/roomTypeAmenity.validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomTypeAmenity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         roomTypeId:
 *           type: string
 *           format: uuid
 *         amenityId:
 *           type: string
 *           format: uuid
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RoomTypeAmenityPaginationInfo:
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
 * /api/room-type-amenities:
 *   get:
 *     summary: Get all room type amenities with pagination
 *     tags:
 *       - Room Type Amenities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by room type name or amenity name
 *     responses:
 *       200:
 *         description: Room type amenities retrieved successfully
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
 *                     $ref: '#/components/schemas/RoomTypeAmenity'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 */
router.get(
  '/',
  authenticateToken,
  validate(paginationSchema, 'query'),
  getAllRoomTypeAmenities
);

/**
 * @swagger
 * /api/room-type-amenities/all:
 *   get:
 *     summary: Get all active room type amenities
 *     tags:
 *       - Room Type Amenities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active room type amenities retrieved successfully
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
 *                     $ref: '#/components/schemas/RoomTypeAmenity'
 */
router.get('/all', authenticateToken, getActiveRoomTypeAmenities);

/**
 * @swagger
 * /api/room-type-amenities:
 *   post:
 *     summary: Create a new room type amenity mapping
 *     tags:
 *       - Room Type Amenities
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomTypeId
 *               - amenityId
 *             properties:
 *               roomTypeId:
 *                 type: string
 *                 format: uuid
 *               amenityId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Room type amenity created successfully
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
 *                   $ref: '#/components/schemas/RoomTypeAmenity'
 */
router.post(
  '/',
  authenticateToken,
  validate(createRoomTypeAmenitySchema, 'body'),
  createRoomTypeAmenity
);

/**
 * @swagger
 * /api/room-type-amenities/{id}:
 *   get:
 *     summary: Get a room type amenity by ID
 *     tags:
 *       - Room Type Amenities
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
 *         description: Room type amenity retrieved successfully
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
 *                   $ref: '#/components/schemas/RoomTypeAmenity'
 */
router.get('/:id', authenticateToken, getRoomTypeAmenityById);

/**
 * @swagger
 * /api/room-type-amenities/{id}:
 *   put:
 *     summary: Update a room type amenity mapping
 *     tags:
 *       - Room Type Amenities
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
 *               roomTypeId:
 *                 type: string
 *                 format: uuid
 *               amenityId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Room type amenity updated successfully
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
 *                   $ref: '#/components/schemas/RoomTypeAmenity'
 */
router.put(
  '/:id',
  authenticateToken,
  validate(updateRoomTypeAmenitySchema, 'body'),
  updateRoomTypeAmenity
);

/**
 * @swagger
 * /api/room-type-amenities/{id}:
 *   delete:
 *     summary: Delete a room type amenity mapping
 *     tags:
 *       - Room Type Amenities
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
 *         description: Room type amenity deleted successfully
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
router.delete('/:id', authenticateToken, deleteRoomTypeAmenity);

/**
 * @swagger
 * /api/room-type-amenities/{id}/change-status:
 *   put:
 *     summary: Toggle room type amenity status
 *     tags:
 *       - Room Type Amenities
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
 *         description: Room type amenity status toggled successfully
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
 *                   $ref: '#/components/schemas/RoomTypeAmenity'
 *       404:
 *         description: Room type amenity not found
 */
router.put('/:id/change-status', authenticateToken, toggleRoomTypeAmenityStatus);

export default router;
