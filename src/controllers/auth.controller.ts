// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { loginRequestSchema } from '@/validators/auth.validator';

// SERVICES //
import { loginService } from '@/services/auth.service';

/**
 * Auth Controller - Handles authentication related endpoints
 */
export class AuthController {
  /**
   * POST /auth/login
   * Initiate OTP login for the provided phone number
   */
  async login(c: Context) {
    try {
      // Parse the raw request body — throws if JSON is malformed
      let body: unknown;
      try {
        body = await c.req.json();
      } catch {
        return errorResponse(
          c,
          'Malformed JSON in request body',
          ERROR_MESSAGES.BAD_REQUEST,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Validate the parsed body against the schema
      const parsed = loginRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;
        return errorResponse(c, errorMessage, ERROR_MESSAGES.VALIDATION_FAILED, HTTP_STATUS.UNPROCESSABLE_ENTITY);
      }

      const { phone_number } = parsed.data;

      // Call the service layer
      const { data, error } = await loginService({ phone_number });

      // Phone number not found in either table
      if (error?.message === ERROR_MESSAGES.PHONE_NOT_FOUND) {
        return errorResponse(c, 'Phone number not found', ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      // Other service error
      if (error) {
        return errorResponse(c, error.message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      // OTP sent successfully
      return successResponse(c, data, 'OTP sent successfully', HTTP_STATUS.OK);
    } catch (err) {
      // Any other unexpected errors
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

// Controller instance for handling Auth related API requests
export const authController = new AuthController();
