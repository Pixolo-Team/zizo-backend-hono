import type { Context } from "hono";

/**
 * Sends a standardised JSON response from a Hono controller.
 *
 * @param c       - Hono context
 * @param data    - Response payload (null on error)
 * @param status  - HTTP status code
 * @param message - Human-readable status message
 * @param error   - Optional error message string
 */
export const sendResponse = <T>(
  c: Context,
  data: T | null,
  status: number,
  message: string,
  error?: string
): Response => {
  return c.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
      ...(error !== undefined && { error }),
    },
    status as Parameters<Context["json"]>[1]
  );
};
