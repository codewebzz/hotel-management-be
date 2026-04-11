import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z
    .string()
    .min(1, "Amenity name is required")
    .max(255, "Amenity name cannot exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  icon: z
    .string()
    .max(255, "Icon name cannot exceed 255 characters")
    .optional(),
});

export const updateAmenitySchema = z.object({
  name: z
    .string()
    .min(1, "Amenity name must not be empty")
    .max(255, "Amenity name cannot exceed 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  icon: z
    .string()
    .max(255, "Icon name cannot exceed 255 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export const amenityIdSchema = z.object({
  id: z.string().uuid("Invalid amenity ID format"),
});

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .positive("Page must be greater than 0")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .positive("Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .default(10)
    .optional(),
  search: z.string().optional(),
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
export type AmenityIdInput = z.infer<typeof amenityIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
