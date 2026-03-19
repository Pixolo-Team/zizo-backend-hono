// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// SERVICES //
import { getUserInvitesService, createInviteService, respondToInviteService } from '@/services/invite.service';


// VALIDATORS //
import { createInviteRequestSchema, respondToInviteRequestSchema } from '@/validators/invite.validator';


/**
 * Invite Controller - Handles all Invites related endpoints
 */
export class InviteController {

  /**
   * POST /invites/get-user-invites
   * Fetch all pending Organization_Invites for a User
   */
  async getUserPendingInvites(c: Context) {
    try {
      // Get the authenticated User from context (set by auth middleware)
      const user = c.get('user');
      const phoneNumber = user?.phone;
      
      
      // Return 401 if User is not authenticated or phone_number is missing
      if (!phoneNumber) {
        return errorResponse(
          c,
          ERROR_MESSAGES.UNAUTHORIZED,
          ERROR_MESSAGES.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Call the service layer with phone_number from Auth context
      const { data, error } = await getUserInvitesService(phoneNumber);
      

      // Database or unexpected error
      if (error) {
        return errorResponse(
          c,
          'Failed to fetch Organization Invites',
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // No pending Organization_Invites found
      if (!data || data.length === 0) {
        return errorResponse(
          c,
          'No pending Organization Invites found for this User',
          'No pending Organization Invites found for this User',
          HTTP_STATUS.NOT_FOUND
        );
      }

      return successResponse(c, data, 'Pending Organization Invites fetched successfully', HTTP_STATUS.OK);
    } catch (err) {
      // Any other unexpected errors
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * POST /invites/create
   * Create a new Organization_Invite
   */
  async createInvite(c: Context) {
    try {
      
      // Get the authenticated User from middleware context
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

      const { phone_number, organization_id, member_role_id, auth_id } = parsed.data;
      
      // Call the service layer with the constructed Invite DTO
      const { data, error } = await createInviteService({
        auth_id: auth_id ?? null,
        phone_number,
        member_role_id,
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

      return successResponse(c, data, 'Organization Invite created successfully', HTTP_STATUS.CREATED);
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

  /**
   * POST /organization-invites/respond
   * Accept or reject an Organization Invite
   */
  async respondToInvite(c: Context) {
    try {
      // Get the authenticated User from middleware context
      const user = c.get('user');
      const authId = user.id;
      // phone may be absent for non-phone-based auth users
      const phoneNumber = user?.phone ?? null;

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
      const parsedBody = respondToInviteRequestSchema.safeParse(body);

      if (!parsedBody.success) {
        const errorMessage = parsedBody.error.issues[0]?.message ?? 'Validation failed';
        return errorResponse(
          c,
          errorMessage,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      // Call the service with validated data and User context
      const result = await respondToInviteService({
        organization_invite_id: parsedBody.data.organization_invite_id,
        action: parsedBody.data.action,
        auth_id: authId,
        phone_number: phoneNumber,
      });

      // Map business logic error codes to HTTP status codes
      if (result.error) {
        switch (result.errorCode) {
          // Invite not found
          case 'NOT_FOUND':
            return errorResponse(c, result.error.message, 'Invite not found', HTTP_STATUS.NOT_FOUND);

          // Invite does not belong to the authenticated User
          case 'FORBIDDEN':
            return errorResponse(c, result.error.message, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);

          // Invite has already been processed
          case 'CONFLICT':
            return errorResponse(c, result.error.message, 'Invite already processed', HTTP_STATUS.CONFLICT);

          // Generic internal server error
          default:
            return errorResponse(c, result.error.message, 'Failed to process Invite', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
      }

      return successResponse(c, result.data, 'Invitation processed successfully', HTTP_STATUS.OK);
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
