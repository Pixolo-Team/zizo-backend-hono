// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// SERVICES //
import { getUserInvitesService } from '@/services/invite.service';

/**
 * Invite Controller - Handles all Invites related endpoints
 */
export class InviteController {
  /**
   * POST /invites/get-user-invites
   * Fetch all pending Invites for a User
   */
  async getUserPendingInvites(c: Context) {
    try {
      // Get the authenticated user from context (set by auth middleware)
      const user = c.get('user') as { phone_number: string } | undefined;
      const phoneNumber = user?.phone_number;

      // Return 401 if user is not authenticated or phone_number is missing
      if (!phoneNumber) {
        return errorResponse(
          c,
          ERROR_MESSAGES.UNAUTHORIZED,
          ERROR_MESSAGES.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Call the service layer with phone_number from auth context
      const { data, error } = await getUserInvitesService(phoneNumber);

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
          'No pending invites found for this user',
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
