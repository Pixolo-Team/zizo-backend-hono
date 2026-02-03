import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiResponse } from "@/common/types/api.response.type.js";

/**
 * Sends a standardized API response.
 * @param c - Hono Context
 * @param data - The data to be sent in the response
 * @param statusCode - HTTP Status Code
 * @param message - Succes or Error Message
 * @param error - Detailed error message if any
 * @returns Standardized Hono JSON response
 */
export const sendResponse = <T>(
  c: Context,
  data: T | null,
  statusCode: number,
  message: string,
  error: string | null = null,
): Response => {
  const responseBody: ApiResponse<T> = {
    data,
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    status_code: statusCode,
    message,
    error,
  };

  return c.json(responseBody, statusCode as ContentfulStatusCode);
};
