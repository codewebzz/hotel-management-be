import { z } from 'zod';

export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(50, 'Room number cannot exceed 50 characters'),
  roomTypeId: z.string().uuid('RoomType ID must be a valid UUID'),
  floor: z.coerce.number().optional(),
  notes: z.string().optional(),
  companyId: z.string().uuid('Company ID must be a valid UUID'),
  brandId: z.string().uuid('Brand ID must be a valid UUID'),
  branchId: z.string().uuid('Branch ID must be a valid UUID'),
});

export const updateRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number must not be empty')
    .max(50, 'Room number cannot exceed 50 characters')
    .optional(),
  roomTypeId: z.string().uuid('RoomType ID must be a valid UUID').optional(),
  floor: z.coerce.number().optional(),
  notes: z.string().optional(),
  companyId: z.string().uuid('Company ID must be a valid UUID').optional(),
  brandId: z.string().uuid('Brand ID must be a valid UUID').optional(),
  branchId: z.string().uuid('Branch ID must be a valid UUID').optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

