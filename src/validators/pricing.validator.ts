import { z } from 'zod';

export const createPricingSchema = z
  .object({
    roomTypeId: z.string().uuid('RoomType ID must be a valid UUID'),
    basePrice: z.coerce
      .number()
      .positive('Base price must be greater than 0'),
    seasonName: z
      .string()
      .min(1, 'Season name is required')
      .max(255, 'Season name cannot exceed 255 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    }
  );

export const updatePricingSchema = z
  .object({
    roomTypeId: z.string().uuid('RoomType ID must be a valid UUID').optional(),
    basePrice: z.coerce.number().positive().optional(),
    seasonName: z
      .string()
      .min(1, 'Season name must not be empty')
      .max(255, 'Season name cannot exceed 255 characters')
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    }
  );

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreatePricingInput = z.infer<typeof createPricingSchema>;
export type UpdatePricingInput = z.infer<typeof updatePricingSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

