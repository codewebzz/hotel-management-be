import { z } from 'zod';

export const createBookingSchema = z
  .object({
    customerId: z.string().uuid('Customer ID must be a valid UUID'),
    roomId: z.string().uuid('Room ID must be a valid UUID'),
    branchId: z.string().uuid('Branch ID must be a valid UUID'),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
    adults: z.coerce.number().int().positive('Adults must be at least 1'),
    children: z.coerce.number().int().min(0).default(0).optional(),
    totalAmount: z.coerce.number().positive('Total amount must be > 0'),
    discount: z.coerce.number().min(0).default(0).optional(),
    tax: z.coerce.number().min(0).default(0).optional(),
    status: z
      .string()
      .min(1)
      .refine(
        (s) =>
          ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].includes(
            s
          ),
        { message: 'Invalid status' }
      ),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.checkInDate) < new Date(data.checkOutDate),
    {
      message: 'checkInDate must be before checkOutDate',
      path: ['checkInDate'],
    }
  );

export const updateBookingSchema = z
  .object({
    customerId: z.string().uuid().optional(),
    roomId: z.string().uuid().optional(),
    branchId: z.string().uuid().optional(),
    checkInDate: z.string().optional(),
    checkOutDate: z.string().optional(),
    adults: z.coerce.number().int().positive().optional(),
    children: z.coerce.number().int().min(0).optional(),
    totalAmount: z.coerce.number().positive().optional(),
    discount: z.coerce.number().min(0).optional(),
    tax: z.coerce.number().min(0).optional(),
    status: z
      .string()
      .refine(
        (s) =>
          ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].includes(
            s
          ),
        { message: 'Invalid status' }
      )
      .optional(),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.checkInDate && data.checkOutDate) {
        return new Date(data.checkInDate) < new Date(data.checkOutDate);
      }
      return true;
    },
    {
      message: 'checkInDate must be before checkOutDate',
      path: ['checkInDate'],
    }
  );

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

