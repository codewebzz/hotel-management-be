import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import type { Multer } from 'multer';
import { imageValidator, uploadSingleImageSchema, uploadMultipleImagesSchema, imageFilenameSchema } from '../utils/imageValidator';
import { SendSuccess, SendError } from '../utils/response';

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
  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return SendError(res, 'No file uploaded', 400);
      }

      // Validate file using zod schema
      const validation = uploadSingleImageSchema.safeParse({ file: req.file });
      console.log("Validation result:", validation);
      if (!validation.success) {
        return SendError(res, 'File validation failed', 400, null, {
          errors: "error",
        });
      }

      const { file } = req;

      // Generate unique filename
      const filename = imageValidator.generateSafeFilename(file);
      const filepath = path.join(this.uploadDir, filename);

      // Save file
      fs.writeFileSync(filepath, file.buffer);

      const imageUrl = `/uploads/${filename}`;

      return SendSuccess(res, 'Image uploaded successfully', {
        filename,
        size: file.size,
        mimetype: file.mimetype,
        url: imageUrl,
        path: filepath,
      });
    } catch (error: any) {
      return SendError(res, 'Error uploading image', 500, error);
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        return SendError(res, 'No files uploaded', 400);
      }

      // Validate all files using zod schema
      const validation = uploadMultipleImagesSchema.safeParse({ files });
      if (!validation.success) {
        return SendError(res, 'File validation failed', 400, null, {
          errors: "error",
        });
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

      const isSuccess = uploadedImages.length > 0;
      const responseCode = isSuccess ? 200 : 400;
      return SendSuccess(
        res,
        isSuccess ? 'Images uploaded successfully' : 'Failed to upload images',
        {
          uploaded: uploadedImages,
          failed: errors,
          total: files.length,
          successCount: uploadedImages.length,
          failureCount: errors.length,
        },
        responseCode
      );
    } catch (error: any) {
      return SendError(res, 'Error uploading images', 500, error);
    }
  }

  /**
   * Get image by filename
   */
  async getImage(req: Request, res: Response) {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        return SendError(res, 'Invalid filename', 400, null, {
          errors: "error",
        });
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        return SendError(res, 'Image not found', 404);
      }

      res.sendFile(filepath);
    } catch (error: any) {
      return SendError(res, 'Error retrieving image', 500, error);
    }
  }

  /**
   * Delete image
   */
  async deleteImage(req: Request, res: Response) {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        return SendError(res, 'Invalid filename', 400, null, {
          errors: "error",
        });
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        return SendError(res, 'Image not found', 404);
      }

      fs.unlinkSync(filepath);

      return SendSuccess(res, 'Image deleted successfully', { filename });
    } catch (error: any) {
      return SendError(res, 'Error deleting image', 500, error);
    }
  }

  /**
   * Get image info
   */
  async getImageInfo(req: Request, res: Response) {
    try {
      const { filename } = req.params;

      // Validate filename using zod schema
      const validation = imageFilenameSchema.safeParse({ filename });
      if (!validation.success) {
        return SendError(res, 'Invalid filename', 400, null, {
          errors: "error",
        });
      }

      const filepath = path.join(this.uploadDir, filename);

      if (!fs.existsSync(filepath)) {
        return SendError(res, 'Image not found', 404);
      }

      const stats = fs.statSync(filepath);

      return SendSuccess(res, 'Image info retrieved successfully', {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
        url: `/uploads/${filename}`,
      });
    } catch (error: any) {
      return SendError(res, 'Error retrieving image info', 500, error);
    }
  }

  /**
   * List all uploaded images
   */
  async listImages(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1) {
        return SendError(res, 'Page number must be greater than 0', 400);
      }

      if (limit < 1 || limit > 100) {
        return SendError(res, 'Limit must be between 1 and 100', 400);
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

      return SendSuccess(res, 'Images retrieved successfully', imageData, 200, {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return SendError(res, 'Error retrieving images', 500, error);
    }
  }
}

export const imageController = new ImageController();
