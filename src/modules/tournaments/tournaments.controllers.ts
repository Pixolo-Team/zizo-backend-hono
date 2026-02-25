// OTHERS //
import type { Context } from "hono";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import {
  getTournamentsService,
  getTournamentDetailsService,
} from "./tournaments.services.js";

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

/**
 * Controller to get full details of a single tournament by ID
 * @param c - Hono Context
 * @returns Promise with JSON response
 */
export const getTournamentDetails = async (c: Context): Promise<Response> => {
  const id = c.req.param("id");

  if (!id) {
    return sendResponse(c, null, 400, "Tournament ID is required");
  }

  const result = await getTournamentDetailsService(id);

  if (result.error) {
    if (result.error.message.includes("JSON object requested")) {
      return sendResponse(c, null, 404, "Tournament not found");
    }

    return sendResponse(
      c,
      null,
      500,
      "Failed to fetch tournament details",
      result.error.message,
    );
  }

  if (!result.data) {
    return sendResponse(c, null, 404, "Tournament not found");
  }

  return sendResponse(
    c,
    result.data,
    200,
    "Tournament details fetched successfully",
  );
};
