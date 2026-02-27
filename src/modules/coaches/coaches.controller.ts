// TYPES //
import type { Context } from "hono";
import type { CreateCoachBody } from "./coaches.types.js";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { createCoachService } from "./coaches.service.js";

/**
 * Handles POST /coaches - Creates a new coach.
 * @param c - Hono Context
 * @returns Standardized API response with the created coach
 */
export const createCoach = async (c: Context): Promise<Response> => {
  const body = await c.req.json<CreateCoachBody>();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!body.name?.trim() || !body.email?.trim()) {
    return sendResponse(c, null, 400, "name and email are required", "Validation failed");
  }

  if (!EMAIL_REGEX.test(body.email)) {
    return sendResponse(c, null, 400, "Invalid email format", "Validation failed");
  }

  const result = await createCoachService(body);

  if (result.error) {
    return sendResponse(c, null, 500, "Failed to create coach", result.error.message);
  }

  return sendResponse(c, result.data, 201, "Coach created successfully");
};
