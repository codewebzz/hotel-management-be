import { z } from 'zod';

export const createInvoiceSchema = z.object({
  bookingId: z.string().uuid('Booking ID must be a valid UUID'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  tax: z.coerce.number().min(0).default(0).optional(),
  discount: z.coerce.number().min(0).default(0).optional(),
  paymentStatus: z
    .string()
    .min(1)
    .refine(
      (s) => ['pending', 'paid', 'cancelled', 'partial'].includes(s),
      { message: 'Invalid paymentStatus' }
    ),
  paymentMethod: z
    .string()
    .optional(),
  paidAmount: z.coerce.number().min(0).default(0).optional(),
});

export const updateInvoiceSchema = z.object({
  bookingId: z.string().uuid('Booking ID must be a valid UUID').optional(),
  amount: z.coerce.number().positive('Amount must be greater than 0').optional(),
  tax: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional(),
  paymentStatus: z
    .string()
    .refine(
      (s) => ['pending', 'paid', 'cancelled', 'partial'].includes(s),
      { message: 'Invalid paymentStatus' }
    )
    .optional(),
  paymentMethod: z.string().optional(),
  paidAmount: z.coerce.number().min(0).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

