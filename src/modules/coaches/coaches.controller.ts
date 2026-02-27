// TYPES //
import type { Context } from "hono";
import type { CreateCoachBody } from "./coaches.types.js";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { createCoachService } from "./coaches.service.js";

/**
 * Creates a new coach
 * @param c - Hono Context
 * @returns Standardized API response with created coach
 */
export const createCoach = async (c: Context): Promise<Response> => {
  const body = await c.req.json<CreateCoachBody>();
  const { data, error } = await createCoachService(body);

  if (error) {
    return sendResponse(c, null, 400, "Failed to create coach", error.message);
  }

  return sendResponse(c, data, 201, "Coach created successfully");
};
