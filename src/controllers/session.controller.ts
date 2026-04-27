// TYPES //
import type { Context } from 'hono';

// UTILS //
import { errorResponse, successResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';

// SERVICES //
import { createSessionService, editSessionService } from '@/services/session.service';

// VALIDATORS //
import {
  createSessionRequestSchema,
  editSessionRequestSchema,
  sessionParamsSchema,
} from '@/validators/session.validator';

/**
 * Session Controller - Handles Session related endpoints
 */
export class SessionController {
  /**
   * POST /session/create
   * Create a new Session
   */
  async createSession(c: Context) {
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

      const parsed = createSessionRequestSchema.safeParse(body);

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
      const { data, error } = await createSessionService(user.id, parsed.data);

      if (error?.message === ERROR_MESSAGES.FORBIDDEN) {
        return errorResponse(
          c,
          'User is not a member of any organization',
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      if (error?.message === ERROR_MESSAGES.NOT_FOUND) {
        return errorResponse(
          c,
          'Batch, Venue, or Session members not found for this organization',
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
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

      return successResponse(c, data, 'Session created successfully', HTTP_STATUS.CREATED);
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
   * PATCH /session/edit/{id}
   * Edit an existing Session
   */
  async editSession(c: Context) {
    try {
      const paramsParsed = sessionParamsSchema.safeParse(c.req.param());

      if (!paramsParsed.success) {
        const errorMessage = paramsParsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;
        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
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

      const parsed = editSessionRequestSchema.safeParse(body);

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
      const { data, error } = await editSessionService(user.id, paramsParsed.data.id, parsed.data);

      if (error?.message === ERROR_MESSAGES.FORBIDDEN) {
        return errorResponse(
          c,
          'User is not a member of any organization',
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      if (error?.message === ERROR_MESSAGES.NOT_FOUND) {
        return errorResponse(
          c,
          'Session, Batch, Venue, or Session members not found for this organization',
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
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

      return successResponse(c, data, 'Session updated successfully', HTTP_STATUS.OK);
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
 * Controller instance for Session endpoints
 */
export const sessionController = new SessionController();
