// TYPES //
import type { Context } from "hono";
import type { CoachCreateData } from "./coaches.types.js";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { createCoachService } from "./coaches.services.js";

/**
 * Controller to create a new coach
 * @param c - Hono Context
 * @returns Promise with JSON response containing the created coach
 */
export const createCoach = async (c: Context): Promise<Response> => {
  const body = await c.req.json<CoachCreateData>();

  if (!body.name || !body.email) {
    return sendResponse(c, null, 400, "name and email are required");
  }

  const result = await createCoachService({ name: body.name, email: body.email });

  if (result.error) {
    return sendResponse(
      c,
      null,
      500,
      "Failed to create coach",
      result.error.message,
    );
  }

  return sendResponse(c, result.data, 201, "Coach created successfully");
};
