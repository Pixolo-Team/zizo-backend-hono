import type { Context } from 'hono';

import { errorResponse, successResponse } from '@/common/utils/api.util';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';
import { createSubscriptionPlanService } from '@/services/subscription-plans.service';
import { createSubscriptionPlanRequestSchema } from '@/validators/subscription-plans.validator';

export class SubscriptionPlansController {
  /**
   * POST /subscription-plans
   * Create a subscription plan for a training center
   */
  async createSubscriptionPlan(c: Context) {
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

      const parsed = createSubscriptionPlanRequestSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message ?? 'Invalid subscription plan payload';

        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const result = await createSubscriptionPlanService(parsed.data, user.id);

      if (result.error) {
        switch (result.errorCode) {
          case 'FORBIDDEN':
            return errorResponse(c, result.error.message, 'Unauthorized access', HTTP_STATUS.FORBIDDEN);
          case 'NOT_FOUND':
            return errorResponse(c, result.error.message, result.error.message, HTTP_STATUS.NOT_FOUND);
          case 'VALIDATION':
            return errorResponse(
              c,
              result.error.message,
              ERROR_MESSAGES.VALIDATION_FAILED,
              HTTP_STATUS.UNPROCESSABLE_ENTITY
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

      return successResponse(
        c,
        result.data,
        'Subscription plan created successfully',
        HTTP_STATUS.CREATED
      );
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

export const subscriptionPlansController = new SubscriptionPlansController();
