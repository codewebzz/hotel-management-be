import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getActiveCompanies,
  toggleCompanyStatus,
} from "../controllers/companyController";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createCompanySchema,
  updateCompanySchema,
  paginationSchema,
} from "../validators/company.validator";

const router: Router = Router();

// Protected company routes with validation
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies with pagination
 *     tags:
 *       - Companies
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
 *         description: Search query for companies
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 */
router.get(
  "/",
  authenticateToken,
  validate(paginationSchema, "query"),
  getAllCompanies
);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - Companies
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *
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
 *         description: Company created successfully
 */
router.post(
  "/",
  authenticateToken,
  validate(createCompanySchema, "body"),
  createCompany
);

/**
 * @swagger
 * /api/companies/all:
 *   get:
 *     summary: Get all companies for dropdowns or selection lists
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All Active companies retrieved successfully
 */
router.get("/all", authenticateToken, getActiveCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags:
 *       - Companies
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
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
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
 *         description: Company updated successfully
 */
router.put(
  "/:id",
  authenticateToken,
  validate(updateCompanySchema, "body"),
  updateCompany
);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags:
 *       - Companies
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
 *         description: Company deleted successfully
 */
router.delete("/:id", authenticateToken, deleteCompany);

/**
 * @swagger
 * /api/companies/{id}/change-status:
 *   put:
 *     summary: Toggle company status (activate if inactive, deactivate if active)
 *     tags:
 *       - Companies
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
 *         description: Company status toggled successfully
 *       404:
 *         description: Company not found
 */
router.put("/:id/change-status", authenticateToken, toggleCompanyStatus);

export default router;
