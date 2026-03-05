// HONO //
import { JSONObject } from 'hono/utils/types';

export interface Organizer {
  id: string;
  name: string;
  type: string;
  description: string;
  contact_name: string;
  contact_phont: string;
  whatsapp_phone: string;
  logo_url: string;
  created_at: Date;
  external_ref_id: string | null;
  social_pltforms: JSONObject;
}
