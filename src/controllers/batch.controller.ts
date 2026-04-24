// TYPES //
import type { Context } from 'hono';

// UTILS //
import { errorResponse, successResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';

// SERVICES //
import { createBatchService, editBatchService } from '@/services/batch.service';

// VALIDATORS //
import {
  batchParamsSchema,
  createBatchRequestSchema,
  editBatchRequestSchema,
} from '@/validators/batch.validator';

/**
 * Batch Controller - Handles Batch related endpoints
 */
export class BatchController {
  /**
   * POST /batch/create
   * Create a new Batch
   */
  async createBatch(c: Context) {
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

      const parsed = createBatchRequestSchema.safeParse(body);

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
      const { data, error } = await createBatchService(user.id, parsed.data);

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
          'Center, Venue, Coach users, or Players not found for this organization',
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

      return successResponse(c, data, 'Batch created successfully', HTTP_STATUS.CREATED);
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
   * PATCH /batch/edit/{batch_id}
   * Edit an existing Batch
   */
  async editBatch(c: Context) {
    try {
      const paramsParsed = batchParamsSchema.safeParse(c.req.param());

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

      const parsed = editBatchRequestSchema.safeParse(body);

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
      const { data, error } = await editBatchService(user.id, paramsParsed.data.batch_id, parsed.data);

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
          'Batch, Center, Venue, Coach users, or Players not found for this organization',
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

      return successResponse(c, data, 'Batch updated successfully', HTTP_STATUS.OK);
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
 * Controller instance for Batch endpoints
 */
export const batchController = new BatchController();
