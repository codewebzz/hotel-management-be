import { Router } from "express";
import {
  createAmenity,
  getAllAmenities,
  getAllAmenitiesWithoutPagination,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} from "../controllers/amenityController";
import { validate } from "../middleware/validate";
import {
  amenityIdSchema,
  createAmenitySchema,
  paginationSchema,
  updateAmenitySchema,
} from "../validators/amenity.validator";
import { authenticateToken } from "../middleware/auth";

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Amenity:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the amenity
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: Amenity name
 *           example: "Wi-Fi"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Amenity description
 *           example: "Free high-speed internet access"
 *         icon:
 *           type: string
 *           nullable: true
 *           description: Icon name only (no file path)
 *           example: "wifi-icon"
 *         isActive:
 *           type: boolean
 *           description: Whether the amenity is active
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           example: 100
 *         page:
 *           type: number
 *           example: 1
 *         limit:
 *           type: number
 *           example: 10
 *         totalPages:
 *           type: number
 *           example: 10
 */

/**
 * @swagger
 * /api/amenities:
 *   get:
 *     summary: Get all amenities with pagination
 *     tags: [Amenities]
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
 *     responses:
 *       200:
 *         description: Amenities fetched successfully
 */
router.get("/", authenticateToken, validate(paginationSchema), getAllAmenities);

/**
 * @swagger
 * /api/amenities/all/list:
 *   get:
 *     summary: Get all amenities without pagination
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amenities fetched successfully
 */
router.get("/all/list", authenticateToken, getAllAmenitiesWithoutPagination);

/**
 * @swagger
 * /api/amenities:
 *   post:
 *     summary: Create a new amenity
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Amenity created successfully
 */
router.post(
  "/",
  authenticateToken,
  validate(createAmenitySchema),
  createAmenity
);

/**
 * @swagger
 * /api/amenities/{id}:
 *   get:
 *     summary: Get amenity by ID
 *     tags: [Amenities]
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
 *         description: Amenity fetched successfully
 */
router.get(
  "/:id",
  authenticateToken,
  validate(amenityIdSchema),
  getAmenityById
);

/**
 * @swagger
 * /api/amenities/{id}:
 *   put:
 *     summary: Update amenity details
 *     tags: [Amenities]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Amenity updated successfully
 */
router.put(
  "/:id",
  authenticateToken,
  validate(updateAmenitySchema),
  updateAmenity
);

/**
 * @swagger
 * /api/amenities/{id}:
 *   delete:
 *     summary: Delete amenity
 *     tags: [Amenities]
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
 *         description: Amenity deleted successfully
 */
router.delete(
  "/:id",
  authenticateToken,
  validate(amenityIdSchema),
  deleteAmenity
);

export default router;
