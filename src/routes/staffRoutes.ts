import { Router } from 'express';
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getActiveStaff,
  toggleStaffStatus,
} from '../controllers/staffController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createStaffSchema,
  updateStaffSchema,
  paginationSchema,
} from '../validators/staff.validator';

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         branchId:
 *           type: string
 *           format: uuid
 *         position:
 *           type: string
 *         salary:
 *           type: number
 *           format: float
 *         joinDate:
 *           type: string
 *           format: date
 *         shiftTiming:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     StaffPaginationInfo:
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
 * /api/staff:
 *   get:
 *     summary: Get all staff with pagination
 *     tags:
 *       - Staff
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
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by user name, position or shiftTiming
 *     responses:
 *       200:
 *         description: List of staff retrieved successfully
 */
router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllStaff);

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - branchId
 *               - position
 *               - salary
 *               - joinDate
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               branchId:
 *                 type: string
 *                 format: uuid
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *                 format: float
 *               joinDate:
 *                 type: string
 *                 format: date
 *               shiftTiming:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router.post('/', authenticateToken, validate(createStaffSchema, 'body'), createStaff);

/**
 * @swagger
 * /api/staff/all:
 *   get:
 *     summary: Get active staff (dropdown)
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active staff retrieved successfully
 */
router.get('/all', authenticateToken, getActiveStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get a staff by ID
 *     tags:
 *       - Staff
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
 *         description: Staff retrieved successfully
 */
router.get('/:id', authenticateToken, getStaffById);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update a staff
 *     tags:
 *       - Staff
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
 *               userId:
 *                 type: string
 *                 format: uuid
 *               branchId:
 *                 type: string
 *                 format: uuid
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *                 format: float
 *               joinDate:
 *                 type: string
 *                 format: date
 *               shiftTiming:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Staff updated successfully
 */
router.put('/:id', authenticateToken, validate(updateStaffSchema, 'body'), updateStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete a staff
 *     tags:
 *       - Staff
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
 *         description: Staff deleted successfully
 */
router.delete('/:id', authenticateToken, deleteStaff);

/**
 * @swagger
 * /api/staff/{id}/change-status:
 *   put:
 *     summary: Toggle staff status
 *     tags:
 *       - Staff
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
 *         description: Staff status toggled successfully
 *       404:
 *         description: Staff not found
 */
router.put('/:id/change-status', authenticateToken, toggleStaffStatus);

export default router;

