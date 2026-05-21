import { Router } from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getActiveBranches,
  toggleBranchStatus,
  getBranchesByBrand,
} from "../controllers/branchController";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createBranchSchema,
  updateBranchSchema,
  paginationSchema,
} from "../validators/branch.validator";

const router: Router = Router();

// Protected branch routes with validation

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches with pagination
 *     tags:
 *       - Branches
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
 *         description: Search query for branch names
 *     responses:
 *       200:
 *         description: List of branches retrieved successfully
 */
router.get("/", authenticateToken, validate(paginationSchema, "query"), getAllBranches);

/**
 * @swagger
 * /api/branches:
 *   post:
 *     summary: Create a new branch
 *     tags:
 *       - Branches
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
 *               - brandId
 *             properties:
 *               name:
 *                 type: string
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent brand
 *               address:
 *                 type: string
 *                 description: Full address string to create an Address record
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitude for the address
 *               long:
 *                 type: number
 *                 format: float
 *                 description: Longitude for the address
 *     responses:
 *       201:
 *         description: Branch created successfully
 */
router.post(
  "/",
  authenticateToken,
  validate(createBranchSchema, "body"),
  createBranch
);

/**
 * @swagger
 * /api/branches/all:
 *   get:
 *     summary: Get all active branches for dropdowns
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active branches retrieved successfully
 */
router.get("/all", authenticateToken, getActiveBranches);

// Lazy load: branches belonging to a specific brand
router.get("/by-brand/:brandId", authenticateToken, getBranchesByBrand);


/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags:
 *       - Branches
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
 *         description: Branch retrieved successfully
 */
router.get("/:id", authenticateToken, getBranchById);

/**
 * @swagger
 * /api/branches/{id}:
 *   put:
 *     summary: Update a branch
 *     tags:
 *       - Branches
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
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent brand
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Branch updated successfully
 */
router.put(
  "/:id",
  authenticateToken,
  validate(updateBranchSchema, "body"),
  updateBranch
);

/**
 * @swagger
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete a branch
 *     tags:
 *       - Branches
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
 *         description: Branch deleted successfully
 */
router.delete("/:id", authenticateToken, deleteBranch);

/**
 * @swagger
 * /api/branches/{id}/change-status:
 *   put:
 *     summary: Toggle branch status (activate if inactive, deactivate if active)
 *     tags:
 *       - Branches
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
 *         description: Branch status toggled successfully
 *       404:
 *         description: Branch not found
 */
router.put("/:id/change-status", authenticateToken, toggleBranchStatus);

export default router;

