// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { getUserInvitesRequestSchema } from '@/validators/invite.validator';

// SERVICES //
import { getUserInvitesService } from '@/services/invite.service';

/**
 * Invite Controller - Handles all Invite related endpoints
 */
export class InviteController {
  /**
   * Fetch all pending invites for a user
   * POST /invites/get-user-invites
   * @param c - Hono context
   * @returns JSON response with pending invites or appropriate error
   */
  async getUserInvites(c: Context) {
    try {
      // Parse and validate the request body
      const body = await c.req.json();
      const parsed = getUserInvitesRequestSchema.safeParse(body);

      if (!parsed.success) {
        // Return 422 for validation errors
        return errorResponse(
          c,
          parsed.error.message,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      // Call the service layer with validated auth_id
      const { data, error } = await getUserInvitesService(parsed.data.auth_id);

      // Database or unexpected error
      if (error) {
        return errorResponse(
          c,
          'Failed to fetch invites',
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // No pending invites found
      if (!data || data.length === 0) {
        return errorResponse(
          c,
          '',
          'No pending invites found for this user',
          HTTP_STATUS.NOT_FOUND
        );
      }

      return successResponse(c, data, 'Pending invites fetched successfully', HTTP_STATUS.OK);
    } catch (err) {
      // Any other unexpected errors
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

// Controller instance for handling Invite related API requests
export const inviteController = new InviteController();
