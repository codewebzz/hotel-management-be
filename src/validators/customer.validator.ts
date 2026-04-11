import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string(),
  lat: z.number(),
  long: z.number(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  companyId: z.string().uuid('Company ID must be a valid UUID'),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  companyId: z.string().uuid('Company ID must be a valid UUID').optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
