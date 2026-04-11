import { z } from 'zod';

export const createRoomTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  branchId: z.string().uuid(),
});

export const updateRoomTypeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  branchId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
