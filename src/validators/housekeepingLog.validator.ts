import { z } from 'zod';

export const createHousekeepingLogSchema = z.object({
  roomId: z.string().uuid('Room ID must be a valid UUID'),
  staffId: z.string().uuid('Staff ID must be a valid UUID'),
  branchId: z.string().uuid('Branch ID must be a valid UUID'),
  shift: z.string().min(1).max(50).optional(),
  status: z
    .string()
    .refine(
      (s) => ['pending', 'in_progress', 'completed', 'cancelled'].includes(s),
      { message: 'Invalid status' }
    ),
  assignedAt: z.string().optional(),
  startTime: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
});

export const updateHousekeepingLogSchema = z.object({
  roomId: z.string().uuid().optional(),
  staffId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  shift: z.string().min(1).max(50).optional(),
  status: z
    .string()
    .refine(
      (s) => ['pending', 'in_progress', 'completed', 'cancelled'].includes(s),
      { message: 'Invalid status' }
    )
    .optional(),
  assignedAt: z.string().optional(),
  startTime: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateHousekeepingLogInput = z.infer<typeof createHousekeepingLogSchema>;
export type UpdateHousekeepingLogInput = z.infer<typeof updateHousekeepingLogSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
