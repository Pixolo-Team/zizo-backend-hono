// OTHERS //
import type { Context } from "hono";
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { getIdentitiesService } from "./identities.services.js";

/**
 * Get all the Identities
 * @param c - Hono Context
 * @returns Promise with JSON response
 */
export const getIdentities = async (c: Context): Promise<Response> => {
  // Fetch data from the Service
  const result = await getIdentitiesService();

  if (result.error) {
    return sendResponse(
      c,
      null,
      500,
      "Failed to fetch identities",
      result.error.message,
    );
  }

  return sendResponse(c, result.data, 200, "Identities fetched successfully");
};
