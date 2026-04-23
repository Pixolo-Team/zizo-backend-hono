// TYPES //
import type { Context } from 'hono';

// UTILS //
import { errorResponse, successResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';

// SERVICES //
import { createCenterService, editCenterService } from '@/services/center.service';

// VALIDATORS //
import { createCenterRequestSchema, editCenterRequestSchema } from '@/validators/center.validator';

/**
 * Center Controller - Handles Center related endpoints
 */
export class CenterController {
  /**
   * POST /centers/create
   * Create a new Center
   */
  async createCenter(c: Context) {
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

      const parsed = createCenterRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;
        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const { data, error } = await createCenterService(parsed.data);

      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Center created successfully', HTTP_STATUS.CREATED);
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
   * PATCH /centers/edit/:center_id
   * Edit an existing Center
   */
  async editCenter(c: Context) {
    try {
      const centerId = c.req.param('center_id');

      if (!centerId) {
        return errorResponse(
          c,
          'Center ID is required',
          ERROR_MESSAGES.BAD_REQUEST,
          HTTP_STATUS.BAD_REQUEST
        );
      }

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

      const parsed = editCenterRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;
        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const { data, error } = await editCenterService(centerId, parsed.data);

      if (error?.message === ERROR_MESSAGES.NOT_FOUND) {
        return errorResponse(c, 'Center not found', ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Center updated successfully', HTTP_STATUS.OK);
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
 * Controller instance for Center endpoints
 */
export const centerController = new CenterController();
