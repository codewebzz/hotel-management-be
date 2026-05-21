import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(3),
  brandId: z.string().uuid("Brand ID must be a valid UUID"),
  address: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export const updateBranchSchema = z.object({
  name: z.string().min(1).optional(),
  brandId: z.string().uuid("Brand ID must be a valid UUID").optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
