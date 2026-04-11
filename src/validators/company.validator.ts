import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  lat: z.number(),
  long: z.number(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  lat: z.number(),
  long: z.number(),
  isActive: z.boolean().optional(),
});


export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export const searchCompanyByNameSchema = z.object({
  name: z.string().min(1, 'Company name is required for search'),
  page: z.coerce.number().positive().default(1).optional(),
  limit: z.coerce.number().positive().max(100).default(10).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchCompanyByNameInput = z.infer<typeof searchCompanyByNameSchema>;
