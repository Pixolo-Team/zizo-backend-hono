import { z } from 'zod';

/**
 * Zod schema for creating a Center
 */
export const createCenterRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Center name is required' }),
    location: z.string().min(1, { message: 'Center location is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
  })
  .strict();

/**
 * Zod schema for Center response
 */
export const centerSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  organization_id: z.string(),
});
