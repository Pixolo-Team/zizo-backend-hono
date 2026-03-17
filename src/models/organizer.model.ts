// JSON object type (compatible with Hono's JSONObject)
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONArray = JSONValue[];
type JSONObject = { [key: string]: JSONValue };

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
