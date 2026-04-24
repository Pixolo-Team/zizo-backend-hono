// TYPES //
import type { Context } from 'hono';

// UTILS //
import { errorResponse, successResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';

// SERVICES //
import { createVenueService, getAllVenuesService } from '@/services/venue.service';

// VALIDATORS //
import { createVenueRequestSchema } from '@/validators/venue.validator';

/**
 * Venue Controller - Handles Venue related endpoints
 */
export class VenueController {
  /**
   * GET /venues
   * Get all Venues for authenticated user's organization
   */
  async getAllVenues(c: Context) {
    try {
      const user = c.get('user');
      const { data, error } = await getAllVenuesService(user.id);

      if (error?.message === ERROR_MESSAGES.FORBIDDEN) {
        return errorResponse(
          c,
          'User is not a member of any organization',
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Venues fetched successfully', HTTP_STATUS.OK);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(
        c,
        errorMessage,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /venues/create
   * Create a new Venue
   */
  async createVenue(c: Context) {
    try {
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

      const parsed = createVenueRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;
        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const user = c.get('user');
      const { data, error } = await createVenueService(user.id, parsed.data);

      if (error?.message === ERROR_MESSAGES.FORBIDDEN) {
        return errorResponse(
          c,
          'User is not a member of any organization',
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Venue created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(
        c,
        errorMessage,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

/**
 * Controller instance for Venue endpoints
 */
export const venueController = new VenueController();
