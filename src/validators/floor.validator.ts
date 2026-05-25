import { z } from 'zod';

export const createFloorSchema = z.object({
  floorNumber: z.coerce.number(),
  name: z.string().min(1, 'Name is required').max(100),
});

export type CreateFloorInput = z.infer<typeof createFloorSchema>;
