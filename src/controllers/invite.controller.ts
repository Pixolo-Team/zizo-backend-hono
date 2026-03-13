// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// SERVICES //
import { getUserInvitesService, createInviteService } from '@/services/invite.service';


// VALIDATORS //
import { createInviteRequestSchema } from '@/validators/invite.validator';


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
      // Get the authenticated User from context (set by auth middleware)
      const user = c.get('user');
      const phoneNumber = user?.phone_number;
      
      // Return 401 if User is not authenticated or phone_number is missing
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
          'Failed to fetch Invites',
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // No pending Invites found
      if (!data || data.length === 0) {
        return errorResponse(
          c,
          'No pending Invites found for this User',
          'No pending Invites found for this User',
          HTTP_STATUS.NOT_FOUND
        );
      }

      return successResponse(c, data, 'Pending Invites fetched successfully', HTTP_STATUS.OK);
    } catch (err) {
      // Any other unexpected errors
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * POST /invites/create
   * Create a new Invite
   */
  async createInvite(c: Context) {
    try {
      
      // Get the authenticated user from middleware context
      const user = c.get('user');
      
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
