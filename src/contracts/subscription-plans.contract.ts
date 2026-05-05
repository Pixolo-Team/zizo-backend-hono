import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { apiResponseSchema } from '@/validators/api-response.schema';
import {
  createSubscriptionPlanRequestSchema,
  subscriptionPlanResponseSchema,
} from '@/validators/subscription-plans.validator';

export const createSubscriptionPlanRoute = createRoute({
  method: 'post',
  path: '/subscription-plans',
  tags: ['Subscription Plans'],
  summary: 'Create a subscription plan for a training center',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createSubscriptionPlanRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Subscription plan created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(subscriptionPlanResponseSchema),
        },
      },
    },
    400: {
      description: 'Bad Request - Malformed JSON',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    403: {
      description: 'Forbidden - User does not have permission to create subscription plans',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    404: {
      description: 'Organization or center not found',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    422: {
      description: 'Validation Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
  },
});
