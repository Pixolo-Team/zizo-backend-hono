// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { checkUserByPhoneSchema } from '@/validators/auth.validator';

// SERVICES //
import { checkUserByPhoneService } from '@/services/auth.service';

/**
 * Auth Controller — handles authentication-related endpoints
 */
export class AuthController {
  /**
   * Check whether a user exists in Supabase Auth by phone number
   * POST /auth/check-by-phone
   * @param c - Hono context
   * @returns JSON response with user existence details
   */
  async checkUserByPhone(c: Context) {
    try {
      // Parse and validate the request body
      const body = await c.req.json();
      const parsed = checkUserByPhoneSchema.safeParse(body);

      // Return 422 if validation fails
      if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? 'Validation failed';
        return errorResponse(
          c,
          firstError,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      // Call service layer with validated phone number
      const { data, error } = await checkUserByPhoneService(parsed.data.phone_number);

      // Service-level error (Supabase failure or unexpected runtime error)
      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Determine message based on existence result
      const message = data?.exists ? 'User found' : 'User not found';
      return successResponse(c, data, message, HTTP_STATUS.OK);
    } catch (err) {
      // Catch unexpected errors (e.g. malformed JSON body)
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

export const authController = new AuthController();
