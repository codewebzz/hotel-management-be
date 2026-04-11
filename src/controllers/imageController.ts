import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import type { Multer } from 'multer';
import { imageValidator, uploadSingleImageSchema, uploadMultipleImagesSchema, imageFilenameSchema } from '../utils/imageValidator';

/**
 * Image controller for handling image uploads and management
 */
export class ImageController {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  /**
   * Ensure upload directory exists
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload a single image
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      // Validate file using zod schema
      const validation = uploadSingleImageSchema.safeParse({ file: req.file });
      console.log("Validation result:", validation);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors :"error",
        });
        return;
      }

      const { file } = req;

      // Generate unique filename
      const filename = imageValidator.generateSafeFilename(file);
      const filepath = path.join(this.uploadDir, filename);

      // Save file
      fs.writeFileSync(filepath, file.buffer);

      const imageUrl = `/uploads/${filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename,
          size: file.size,
          mimetype: file.mimetype,
          url: imageUrl,
          path: filepath,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error uploading image',
        error: error.message,
      });
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
        return;
      }

      // Validate all files using zod schema
      const validation = uploadMultipleImagesSchema.safeParse({ files });
      if (!validation.success) {
        const errors = "error";
        res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors,
        });
        return;
      }

      const uploadedImages: any[] = [];
      const errors: any[] = [];

      for (const file of files) {
        try {
          // Generate unique filename
          const filename = imageValidator.generateSafeFilename(file);
          const filepath = path.join(this.uploadDir, filename);

          // Save file
          fs.writeFileSync(filepath, file.buffer);

          uploadedImages.push({
            filename,
            size: file.size,
            mimetype: file.mimetype,
            url: `/uploads/${filename}`,
            path: filepath,
          });
        } catch (err: any) {
          errors.push({
            filename: file.originalname,
            error: err.message,
          });
        }
      }

      res.status(200).json({
        success: uploadedImages.length > 0,
        message: uploadedImages.length > 0 ? 'Images uploaded successfully' : 'Failed to upload images',
        data: {
          uploaded: uploadedImages,
          failed: errors,
          total: files.length,
          successCount: uploadedImages.length,
          failureCount: errors.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error uploading images',
        error: error.message,
      });
    }
  }

  /**
   * Get image by filename
   */
  async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        const errors ="error";
        res.status(400).json({
          success: false,
          message: 'Invalid filename',
          errors,
        });
        return;
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        res.status(404).json({
          success: false,
          message: 'Image not found',
        });
        return;
      }

      res.sendFile(filepath);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving image',
        error: error.message,
      });
    }
  }

  /**
   * Delete image
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        const errors = "error";
        res.status(400).json({
          success: false,
          message: 'Invalid filename',
          errors,
        });
        return;
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        res.status(404).json({
          success: false,
          message: 'Image not found',
        });
        return;
      }

      fs.unlinkSync(filepath);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: { filename },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting image',
        error: error.message,
      });
    }
  }

  /**
   * Get image info
   */
  async getImageInfo(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid filename',
          errors: "error",
        });
        return;
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        res.status(404).json({
          success: false,
          message: 'Image not found',
        });
        return;
      }

      const stats = fs.statSync(filepath);

      res.status(200).json({
        success: true,
        message: 'Image info retrieved successfully',
        data: {
          filename,
          size: stats.size,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
          url: `/uploads/${filename}`,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving image info',
        error: error.message,
      });
    }
  }

  /**
   * List all uploaded images
   */
  async listImages(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1) {
        res.status(400).json({
          success: false,
          message: 'Page number must be greater than 0',
        });
        return;
      }

      if (limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Limit must be between 1 and 100',
        });
        return;
      }

      const files = fs.readdirSync(this.uploadDir);
      const imageFiles = files.filter((file) => imageValidator.isValidImageExtension(file));

      const total = imageFiles.length;
      const skip = (page - 1) * limit;
      const paginatedFiles = imageFiles.slice(skip, skip + limit);

      const imageData = paginatedFiles.map((filename) => {
        const filepath = path.join(this.uploadDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          url: `/uploads/${filename}`,
          createdAt: stats.birthtime,
        };
      });

      res.status(200).json({
        success: true,
        message: 'Images retrieved successfully',
        data: imageData,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving images',
        error: error.message,
      });
    }
  }
}

export const imageController = new ImageController();
