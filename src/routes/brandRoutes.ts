import { Router } from 'express';
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getActiveBrands,
  toggleBrandStatus,
} from '../controllers/brandController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createBrandSchema,
  updateBrandSchema,
  paginationSchema,
} from '../validators/brand.validator';

const router = Router();

// Protected brand routes with validation

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands with pagination
 *     tags:
 *       - Brands
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
 *         description: Search query for brand names
 *     responses:
 *       200:
 *         description: List of brands retrieved successfully
 */
router.get('/', authenticateToken, validate(paginationSchema, 'query'), getAllBrands);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags:
 *       - Brands
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
 *               - email
 *               - branchId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Brand name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Brand email address
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 description: Brand phone number
 *               address:
 *                 type: string
 *                 nullable: true
 *                 description: Full address string to create an Address record
 *               lat:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 description: Latitude for the address
 *               long:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 description: Longitude for the address
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch this brand belongs to
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.post(
  '/',
  authenticateToken,
  validate(createBrandSchema, 'body'),
  createBrand
);

/**
 * @swagger
 * /api/brands/all:
 *   get:
 *     summary: Get all active brands for dropdowns
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active brands retrieved successfully
 */
router.get('/all', authenticateToken, getActiveBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags:
 *       - Brands
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
 *         description: Brand retrieved successfully
 */
router.get('/:id', authenticateToken, getBrandById);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags:
 *       - Brands
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
 *                 description: Brand name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Brand email address
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 description: Brand phone number
 *               address:
 *                 type: string
 *                 description: Full address string (if address changes, it will update the Address record)
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitude for the address
 *               long:
 *                 type: number
 *                 format: float
 *                 description: Longitude for the address
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the branch (optional, if changing branch)
 *               isActive:
 *                 type: boolean
 *                 description: Whether the brand is active
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */
router.put(
  '/:id',
  authenticateToken,
  validate(updateBrandSchema, 'body'),
  updateBrand
);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags:
 *       - Brands
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
 *         description: Brand deleted successfully
 */
router.delete('/:id', authenticateToken, deleteBrand);

/**
 * @swagger
 * /api/brands/{id}/change-status:
 *   put:
 *     summary: Toggle brand status (activate if inactive, deactivate if active)
 *     tags:
 *       - Brands
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
 *         description: Brand status toggled successfully
 *       404:
 *         description: Brand not found
 */
router.put('/:id/change-status', authenticateToken, toggleBrandStatus);
export default router;
