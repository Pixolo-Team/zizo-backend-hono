import { z } from 'zod';

// Get all Organizers validation
export const organizersSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  contact_name: z.string(),
  contact_phont: z.string(),
  whatsapp_phone: z.string(),
  logo_url: z.string(),
  created_at: z.coerce.date(),
  external_ref_id: z.string().nullable(),
  social_pltforms: z.record(z.string(), z.any()),
});
