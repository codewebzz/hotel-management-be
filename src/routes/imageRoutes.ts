import { Router } from 'express';
import multer from 'multer';
import { imageController } from '../controllers/imageController';

const router: Router = Router();

// Configure multer for memory storage (we'll handle file writing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload a single image
 *     description: Upload a single image file (JPEG, PNG, GIF, WebP)
 *     security:
 *       - bearerAuth: [] 
 *     tags:
 *       - Images
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: number
 *                     mimetype:
 *                       type: string
 *                     url:
 *                       type: string
 *                     path:
 *                       type: string
 *       400:
 *         description: Bad request (invalid file or no file uploaded)
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), (req, res) => imageController.uploadImage(req, res));

/**
 * @swagger
 * /api/images/upload-multiple:
 *   post:
 *     summary: Upload multiple images
 *     description: Upload multiple image files at once (JPEG, PNG, GIF, WebP)
 *     tags:
 *       - Images
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *     responses:
 *       200:
 *         description: Images uploaded
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
 *                   type: object
 *                   properties:
 *                     uploaded:
 *                       type: array
 *                       items:
 *                         type: object
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *                     successCount:
 *                       type: number
 *                     failureCount:
 *                       type: number
 *       400:
 *         description: Bad request (no files uploaded)
 *       500:
 *         description: Server error
 */
router.post('/upload-multiple', upload.array('files', 10), (req, res) => imageController.uploadMultipleImages(req, res));

/**
 * @swagger
 * /api/images/list:
 *   get:
 *     summary: List all uploaded images with pagination
 *     description: Retrieve a paginated list of all uploaded images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of images per page
 *     responses:
 *       200:
 *         description: Images list retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                       size:
 *                         type: number
 *                       url:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       400:
 *         description: Bad request (invalid pagination)
 *       500:
 *         description: Server error
 */
router.get('/list', (req, res) => imageController.listImages(req, res));

/**
 * @swagger
 * /api/images/{filename}:
 *   get:
 *     summary: Get image by filename
 *     description: Download or view a specific image file
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Image filename
 *         example: "example-1234567890-abcdef.jpg"
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/jpeg: {}
 *           image/png: {}
 *           image/gif: {}
 *           image/webp: {}
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.get('/:filename', (req, res) => imageController.getImage(req, res));

/**
 * @swagger
 * /api/images/{filename}/info:
 *   get:
 *     summary: Get image information
 *     description: Retrieve metadata about a specific image
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Image filename
 *         example: "example-1234567890-abcdef.jpg"
 *     responses:
 *       200:
 *         description: Image info retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: number
 *                     url:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.get('/:filename/info', (req, res) => imageController.getImageInfo(req, res));

/**
 * @swagger
 * /api/images/{filename}:
 *   delete:
 *     summary: Delete image
 *     description: Delete a specific image file
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Image filename
 *         example: "example-1234567890-abcdef.jpg"
 *     responses:
 *       200:
 *         description: Image deleted successfully
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
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.delete('/:filename', (req, res) => imageController.deleteImage(req, res));

export default router;
