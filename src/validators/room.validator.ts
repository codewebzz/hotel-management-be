import { z } from 'zod';

export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(50, 'Room number cannot exceed 50 characters'),
  roomTypeId: z.string().uuid('RoomType ID must be a valid UUID'),
  floorId: z.string().uuid('Floor ID must be a valid UUID').optional(),
});

export const updateRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number must not be empty')
    .max(50, 'Room number cannot exceed 50 characters')
    .optional(),
  roomTypeId: z.string().uuid('RoomType ID must be a valid UUID').optional(),
  floorId: z.string().uuid('Floor ID must be a valid UUID').optional(),
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

export const bulkRoomItemSchema = z.object({
  roomNumber: z.string().min(1).max(50),
  roomTypeId: z.string().uuid(),
  floorId: z.string().uuid().optional(),
  floor: z.coerce.number().optional(),
});

export const bulkCreateRoomSchema = z.object({
  rooms: z.array(bulkRoomItemSchema).min(1, 'At least one room is required'),
  branchId: z.string().uuid().optional(),
});

export type BulkCreateRoomInput = z.infer<typeof bulkCreateRoomSchema>;
