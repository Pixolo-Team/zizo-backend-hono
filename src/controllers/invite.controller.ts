// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { createInviteRequestSchema } from '@/validators/invite.validator';

// SERVICES //
import { createInviteService } from '@/services/invite.service';

/**
 * Invite Controller - Handles all Invite related endpoints
 */
export class InviteController {
  /**
   * POST /invites/create
   * Create a new Invite
   */
  async createInvite(c: Context) {
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
      const parsed = createInviteRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? 'Validation failed';

        return errorResponse(
          c,
          errorMessage,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const { phone_number, organization_id, membership_role_id, auth_id } = parsed.data;

      // Get the authenticated user from middleware context
      const user = c.get('user');

      // Call the service layer with the constructed invite DTO
      const { data, error } = await createInviteService({
        auth_id: auth_id ?? null,
        phone_number,
        invite_fields: { organization_id, membership_role_id },
        invited_by: user.id,
        organization_id,
      });

      // Database insert failed
      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Invite created successfully', HTTP_STATUS.CREATED);
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

// Controller instance for handling Invite related API requests
export const inviteController = new InviteController();