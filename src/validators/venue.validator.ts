import { z } from 'zod';

/**
 * Zod schema for creating a Venue
 */
export const createVenueRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Venue name is required' }),
    address: z.string().min(1, { message: 'Venue address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    google_link: z.string().url({ message: 'Google link must be a valid URL' }),
  })
  .strict();

/**
 * Zod schema for Venue response
 */
export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  google_link: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  oraganization_id: z.string(),
});
