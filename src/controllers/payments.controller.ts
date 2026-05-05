import type { Context } from 'hono';

import { errorResponse, successResponse } from '@/common/utils/api.util';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';
import { createPaymentService } from '@/services/payments.service';
import { createPaymentRequestSchema } from '@/validators/payments.validator';

export class PaymentsController {
  /**
   * POST /payments
   * Record a player payment and optionally link it to subscription plans
   */
  async createPayment(c: Context) {
    try {
      const user = c.get('user');

      if (!user?.id) {
        return errorResponse(
          c,
          ERROR_MESSAGES.UNAUTHORIZED,
          ERROR_MESSAGES.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
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

      const parsed = createPaymentRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;

        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const result = await createPaymentService(parsed.data, user.id);

      if (result.error) {
        switch (result.errorCode) {
          case 'FORBIDDEN':
            return errorResponse(
              c,
              result.error.message,
              'Unauthorized access',
              HTTP_STATUS.FORBIDDEN
            );
          case 'NOT_FOUND':
            return errorResponse(
              c,
              result.error.message,
              result.error.message,
              HTTP_STATUS.NOT_FOUND
            );
          case 'VALIDATION':
            return errorResponse(
              c,
              result.error.message,
              ERROR_MESSAGES.VALIDATION_FAILED,
              HTTP_STATUS.UNPROCESSABLE_ENTITY
            );
          case 'CONFLICT':
            return errorResponse(
              c,
              result.error.message,
              result.error.message,
              HTTP_STATUS.CONFLICT
            );
          default:
            return errorResponse(
              c,
              result.error.message,
              ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
              HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
      }

      return successResponse(c, result.data, 'Payment recorded successfully', HTTP_STATUS.OK);
    } catch (err) {
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

export const paymentsController = new PaymentsController();
