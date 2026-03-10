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
   * Create a new Invite
   */
  async createInvite(c: Context) {
    try {
      // Parse and validate the request body
      const body = await c.req.json();
      const parsed = createInviteRequestSchema.safeParse(body);

      if (!parsed.success) {
        // Return 422 for validation errors
        return errorResponse(
          c,
          parsed.error.message,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

    //  // Retrieve authenticated user ID from the request header set by Supabase auth
    //   const invitedBy = c.req.header('x-user-id') ?? '';

    //   if (!invitedBy) {
    //     // Return 422 if the user identity header is missing
    //     return errorResponse(
    //       c,
    //       'Missing x-user-id header',
    //       'Validation failed',
    //       HTTP_STATUS.UNPROCESSABLE_ENTITY
    //     );
    //   }

      const { phone_number, organization_id, membership_role_id, auth_id } = parsed.data;

      // Call the service layer with the constructed invite DTO
      const { data, error } = await createInviteService({
        auth_id: auth_id ?? null,
        phone_number,
        invite_fields: { organization_id, membership_role_id },
        is_pending: true,
        invited_by: null,
        organization_id,
        created_on: new Date().toISOString(),
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
