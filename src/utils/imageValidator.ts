import { z } from 'zod';
import * as path from 'path';

/**
 * Zod schemas for image validation
 */

// Single file upload schema
export const uploadSingleImageSchema = z.object({
  file: z
    .any()
    .refine((file) => file !== undefined && file !== null, {
      message: 'File is required',
    })
    .refine((file) => file.buffer instanceof Buffer, {
      message: 'Invalid file format',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype), {
      message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must not exceed 5MB',
    })
    .refine((file) => file.originalname && file.originalname.trim().length > 0, {
      message: 'Invalid filename',
    }),
});

// Multiple files upload schema
export const uploadMultipleImagesSchema = z.object({
  files: z
    .any()
    .array()
    .refine((files) => files && files.length > 0, {
      message: 'At least one file is required',
    })
    .refine(
      (files) =>
        files.every((file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)),
      {
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
      }
    )
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      {
        message: 'File size must not exceed 5MB',
      }
    )
    .refine(
      (files) => files.every((file) => file.originalname && file.originalname.trim().length > 0),
      {
        message: 'Invalid filename',
      }
    ),
});

// Image filename schema
export const imageFilenameSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename cannot exceed 255 characters')
    .refine((filename) => !filename.includes('..') && !filename.includes('/') && !filename.includes('\\'), {
      message: 'Invalid filename - path traversal not allowed',
    }),
});

// Image list/pagination schema
export const imageListSchema = z.object({
  page: z.coerce
    .number()
    .positive('Page must be greater than 0')
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .positive('Limit must be greater than 0')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
    .optional(),
});

// Type exports
export type UploadSingleImageInput = z.infer<typeof uploadSingleImageSchema>;
export type UploadMultipleImagesInput = z.infer<typeof uploadMultipleImagesSchema>;
export type ImageFilenameInput = z.infer<typeof imageFilenameSchema>;
export type ImageListInput = z.infer<typeof imageListSchema>;

/**
 * Image validation utility - Non-zod utility methods
 */
export class ImageValidator {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  /**
   * Generate a safe unique filename
   */
  generateSafeFilename(file: Express.Multer.File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const ext = path.extname(file.originalname).toLowerCase();
    return `${originalName}-${timestamp}-${randomString}${ext}`;
  }

  /**
   * Get MIME type from filename
   */
  getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if file is a valid image by extension
   */
  isValidImageExtension(filename: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return validExtensions.includes(ext);
  }

  /**
   * Get allowed MIME types
   */
  getAllowedMimeTypes(): string[] {
    return [...this.allowedMimeTypes];
  }

  /**
   * Get max file size
   */
  getMaxFileSize(): number {
    return this.maxFileSize;
  }

  /**
   * Get max file size in MB
   */
  getMaxFileSizeInMB(): number {
    return this.maxFileSize / (1024 * 1024);
  }
}

export const imageValidator = new ImageValidator();
