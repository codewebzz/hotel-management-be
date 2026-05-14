import { Router } from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getConfirmedBooking,
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createBookingSchema,
  updateBookingSchema,
  paginationSchema,
} from '../validators/booking.validator';

const router = Router();

router.get('/all', authenticateToken, getConfirmedBooking);

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         bookingNumber:
 *           type: string
 *           description: Unique booking identifier
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: ID of the customer
 *         roomId:
 *           type: string
 *           format: uuid
 *           description: ID of the room
 *         branchId:
 *           type: string
 *           format: uuid
 *           description: ID of the branch
 *         checkInDate:
 *           type: string
 *           format: date
 *         checkOutDate:
 *           type: string
 *           format: date
 *         adults:
 *           type: integer
 *         children:
 *           type: integer
 *         totalAmount:
 *           type: number
 *           format: float
 *         discount:
 *           type: number
 *           format: float
 *         tax:
 *           type: number
 *           format: float
 *         finalAmount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           description: pending | confirmed | checked_in | checked_out | cancelled
 *         specialRequests:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookingPaginationInfo:
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
 * /api/bookings:
 *   get:
 *     summary: Get all bookings with pagination
 *     tags:
 *       - Bookings
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
 *         description: Search by booking number or customer name
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Booking'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 */
router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllBookings);
router.post('/', authenticateToken, validate(createBookingSchema, 'body'), createBooking);
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - roomId
 *               - branchId
 *               - checkInDate
 *               - checkOutDate
 *               - adults
 *               - totalAmount
 *               - status
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               roomId:
 *                 type: string
 *                 format: uuid
 *               branchId:
 *                 type: string
 *                 format: uuid
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               adults:
 *                 type: integer
 *               children:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *                 format: float
 *               discount:
 *                 type: number
 *                 format: float
 *               tax:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: string
 *               specialRequests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                   $ref: '#/components/schemas/Booking'
 */
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id', authenticateToken, validate(updateBookingSchema, 'body'), updateBooking);
/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags:
 *       - Bookings
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
 *         description: Booking retrieved successfully
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
 *                   $ref: '#/components/schemas/Booking'
 */
router.delete('/:id', authenticateToken, deleteBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags:
 *       - Bookings
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
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               roomId:
 *                 type: string
 *                 format: uuid
 *               branchId:
 *                 type: string
 *                 format: uuid
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               adults:
 *                 type: integer
 *               children:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *                 format: float
 *               discount:
 *                 type: number
 *                 format: float
 *               tax:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: string
 *               specialRequests:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
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
 *                   $ref: '#/components/schemas/Booking'
 */
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags:
 *       - Bookings
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
 *         description: Booking deleted successfully
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
router.delete('/:id', authenticateToken, deleteBooking);
router.get('/:id', authenticateToken, getBookingById);

export default router;
