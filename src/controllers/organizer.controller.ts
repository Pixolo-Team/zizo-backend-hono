// HONO //
import { Context } from 'hono';

// UTILS //
import { errorResponse, successResponse } from '@/common/utils/api.util';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';

// SERVICES //
import { organizerService } from '@/services/organizer.service';

/**
 * Organizer Controller - Handles health check endpoints
 */
export class OrganizerController {
  /**
   * Get all Organizers
   * GET /organizers
   */
  async getOrganizers(c: Context) {
    try {
      // Fetch Organizers from the database
      const response = await organizerService.getOrganizersService();

      // Success: Return the organizers
      return successResponse(c, response, 'Fetched Organizers', HTTP_STATUS.OK);
    } catch (error) {
      // Any other Error
      if (error instanceof Error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Default Error
      return errorResponse(
        c,
        'Could not get ORganizers',
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get a single Organizer by the ID
   */
  async getSingleOrganizer(c: Context) {
    return successResponse(
      c,
      {
        id: 1,
      },
      'Organizer Fetched',
      HTTP_STATUS.OK
    );
  }
}

export const organizerController = new OrganizerController();
