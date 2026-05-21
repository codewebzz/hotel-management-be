import { Router } from 'express';
import {
  createPricing,
  getAllPricings,
  getPricingById,
  updatePricing,
  deletePricing,
  getActivePricings,
  togglePricingStatus,
} from '../controllers/pricingController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPricingSchema,
  updatePricingSchema,
  paginationSchema,
} from '../validators/pricing.validator';

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pricing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         roomTypeId:
 *           type: string
 *           format: uuid
 *           description: ID of the room type
 *         basePrice:
 *           type: number
 *           format: float
 *           description: Base price for the room
 *         seasonName:
 *           type: string
 *           description: Season name (e.g. High, Low)
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the pricing season
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the pricing season
 *         isActive:
 *           type: boolean
 *           description: Whether the pricing is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PricingPaginationInfo:
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
 * /api/pricings:
 *   get:
 *     summary: Get all pricings with pagination
 *     tags:
 *       - Pricings
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
 *         description: Search by season name or room type name
 *     responses:
 *       200:
 *         description: List of pricings retrieved successfully
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
 *                     $ref: '#/components/schemas/Pricing'
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
  getAllPricings
);

/**
 * @swagger
 * /api/pricings:
 *   post:
 *     summary: Create a new pricing
 *     tags:
 *       - Pricings
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
 *               - basePrice
 *               - seasonName
 *               - startDate
 *               - endDate
 *             properties:
 *               roomTypeId:
 *                 type: string
 *                 format: uuid
 *               basePrice:
 *                 type: number
 *                 format: float
 *               seasonName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Pricing created successfully
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
 *                   $ref: '#/components/schemas/Pricing'
 */
router.post(
  '/',
  authenticateToken,
  validate(createPricingSchema, 'body'),
  createPricing
);

/**
 * @swagger
 * /api/pricings/all:
 *   get:
 *     summary: Get all active pricings
 *     tags:
 *       - Pricings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active pricings retrieved successfully
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
 *                     $ref: '#/components/schemas/Pricing'
 */
router.get('/all', authenticateToken, getActivePricings);

/**
 * @swagger
 * /api/pricings/{id}:
 *   get:
 *     summary: Get a pricing by ID
 *     tags:
 *       - Pricings
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
 *         description: Pricing retrieved successfully
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
 *                   $ref: '#/components/schemas/Pricing'
 */
router.get('/:id', authenticateToken, getPricingById);

/**
 * @swagger
 * /api/pricings/{id}:
 *   put:
 *     summary: Update a pricing
 *     tags:
 *       - Pricings
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
 *               basePrice:
 *                 type: number
 *                 format: float
 *               seasonName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Pricing updated successfully
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
 *                   $ref: '#/components/schemas/Pricing'
 */
router.put(
  '/:id',
  authenticateToken,
  validate(updatePricingSchema, 'body'),
  updatePricing
);

/**
 * @swagger
 * /api/pricings/{id}:
 *   delete:
 *     summary: Delete a pricing
 *     tags:
 *       - Pricings
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
 *         description: Pricing deleted successfully
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
router.delete('/:id', authenticateToken, deletePricing);

/**
 * @swagger
 * /api/pricings/{id}/change-status:
 *   put:
 *     summary: Toggle pricing status (activate if inactive, deactivate if active)
 *     tags:
 *       - Pricings
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
 *         description: Pricing status toggled successfully
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
 *                   $ref: '#/components/schemas/Pricing'
 *       404:
 *         description: Pricing not found
 */
router.put('/:id/change-status', authenticateToken, togglePricingStatus);

export default router;

