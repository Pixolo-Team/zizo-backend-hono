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
    organization_id: z.string().min(1, { message: 'Organization ID is required' }),
    is_active: z.boolean().optional(),
  })
  .strict();

/**
 * Zod schema for editing a Center
 */
export const editCenterRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Center name is required' }).optional(),
    location: z.string().min(1, { message: 'Center location is required' }).optional(),
    city: z.string().min(1, { message: 'City is required' }).optional(),
    state: z.string().min(1, { message: 'State is required' }).optional(),
    country: z.string().min(1, { message: 'Country is required' }).optional(),
    is_active: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

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
