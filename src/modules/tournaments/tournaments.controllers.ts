// OTHERS //
import type { Context } from "hono";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { getTournamentsService } from "./tournaments.services.js";

/**
 * Controller to get all tournaments
 * @param c - Hono Context
 * @returns Promise with JSON response
 */
export const getTournaments = async (c: Context): Promise<Response> => {
  // Get the tournaments from the Service
  const result = await getTournamentsService();

  if (result.error) {
    return sendResponse(
      c,
      null,
      500,
      "Failed to fetch tournaments",
      result.error.message,
    );
  }

  return sendResponse(c, result.data, 200, "Tournaments fetched successfully");
};
