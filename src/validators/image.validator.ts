import { z } from 'zod';

export const uploadImageSchema = z.object({
  file: z.object({
    originalname: z.string(),
    mimetype: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
      {
        message: 'Only JPEG, PNG, GIF, and WebP images are allowed',
      }
    ),
    size: z.number().max(5 * 1024 * 1024, 'File size must not exceed 5MB'),
  }).optional(),
});

export const uploadMultipleImagesSchema = z.object({
  files: z
    .array(
      z.object({
        originalname: z.string(),
        mimetype: z.string().refine(
          (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
          {
            message: 'Only JPEG, PNG, GIF, and WebP images are allowed',
          }
        ),
        size: z.number().max(5 * 1024 * 1024, 'File size must not exceed 5MB'),
      })
    )
    .optional(),
});

export const imageFilenameSchema = z.object({
  filename: z.string().min(1, 'Filename is required').max(255, 'Filename cannot exceed 255 characters'),
});

export const imageListSchema = z.object({
  page: z.coerce.number().positive('Page must be greater than 0').default(1).optional(),
  limit: z.coerce
    .number()
    .positive('Limit must be greater than 0')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
    .optional(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type UploadMultipleImagesInput = z.infer<typeof uploadMultipleImagesSchema>;
export type ImageFilenameInput = z.infer<typeof imageFilenameSchema>;
export type ImageListInput = z.infer<typeof imageListSchema>;
