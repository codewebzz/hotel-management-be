import { z } from 'zod';

export const createStaffSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  branchId: z.string().uuid('Branch ID must be a valid UUID'),
  position: z.string().min(1, 'Position is required').max(100),
  salary: z.coerce.number().positive('Salary must be greater than 0'),
  joinDate: z.string().min(1, 'Join date is required'),
  shiftTiming: z.string().optional(),
});

export const updateStaffSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID').optional(),
  branchId: z.string().uuid('Branch ID must be a valid UUID').optional(),
  position: z.string().min(1).max(100).optional(),
  salary: z.coerce.number().positive().optional(),
  joinDate: z.string().optional(),
  shiftTiming: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

