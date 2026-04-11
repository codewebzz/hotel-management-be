import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  lat: z.coerce.number().optional(),
  long: z.coerce.number().optional(),
  branchId: z.string().uuid('Branch ID must be a valid UUID'),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  lat: z.coerce.number().optional(),
  long: z.coerce.number().optional(),
  branchId: z.string().uuid('Branch ID must be a valid UUID').optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
