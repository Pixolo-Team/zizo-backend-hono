// OTHER //
import type { Context } from "hono";

// SERVICES //
import { getIdentitiesService } from "@/modules/identities/identities.services.js";

/** Get all the Identities */
export const getIdentities = async (c: Context) => {
  // Fetch data from the Service
  const result = await getIdentitiesService();

  if (result.error) {
    return c.json({ error: result.error.message }, 500);
  }

  return c.json(result.data);
};
