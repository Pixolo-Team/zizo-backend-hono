// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { verifyOtpRequestSchema } from '@/validators/auth.validator';

// SERVICES //
import { verifyOtpService } from '@/services/auth.service';

/**
 * Auth Controller - Handles all Auth related endpoints
 */
export class AuthController {
  /**
   * POST /auth/verify-otp
   * Verify a user's OTP using Supabase Auth
   * @param c - Hono context
   * @returns JSON response with user and session on success
   */
  async verifyOtp(c: Context) {
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
      const parsed = verifyOtpRequestSchema.safeParse(body);

      if (!parsed.success) {
        // Extract first validation error message
        const errorMessage = parsed.error.issues[0]?.message ?? 'Validation failed';

        return errorResponse(
          c,
          errorMessage,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const { phone_number, otp } = parsed.data;

      // Call the service layer to verify OTP
      const { data, error } = await verifyOtpService(phone_number, otp);

      // OTP verification failed — invalid or expired OTP
      if (error) {
        return errorResponse(
          c,
          'OTP verification failed',
          'Invalid or expired OTP',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      return successResponse(c, data, 'OTP verified successfully', HTTP_STATUS.OK);
    } catch (err) {
      // Any other unexpected errors
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(
        c,
        message,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Controller instance for handling Auth related API requests
export const authController = new AuthController();
