import { z } from 'zod';

export const createRoomTypeAmenitySchema = z.object({
  roomTypeId: z.string().uuid('RoomType ID must be a valid UUID'),
  amenityId: z.string().uuid('Amenity ID must be a valid UUID'),
});

export const updateRoomTypeAmenitySchema = z
  .object({
    roomTypeId: z.string().uuid('RoomType ID must be a valid UUID').optional(),
    amenityId: z.string().uuid('Amenity ID must be a valid UUID').optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.roomTypeId !== undefined ||
      data.amenityId !== undefined ||
      data.isActive !== undefined,
    {
      message: 'At least one of roomTypeId, amenityId, or isActive must be provided',
      path: ['roomTypeId'],
    }
  );

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
});

export type CreateRoomTypeAmenityInput = z.infer<
  typeof createRoomTypeAmenitySchema
>;
export type UpdateRoomTypeAmenityInput = z.infer<
  typeof updateRoomTypeAmenitySchema
>;
export type PaginationInput = z.infer<typeof paginationSchema>;
