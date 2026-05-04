import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { apiResponseSchema } from '@/validators/api-response.schema';
import { createPaymentRequestSchema, paymentResponseSchema } from '@/validators/payments.validator';

export const createPaymentRoute = createRoute({
  method: 'post',
  path: '/payments',
  tags: ['Payments'],
  summary: 'Record a player payment and optionally allocate it to subscription plans',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createPaymentRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Payment recorded successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(paymentResponseSchema),
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
      description: 'Forbidden - User does not have permission to create payments',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    404: {
      description: 'Player or subscription plan not found',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    409: {
      description: 'Conflict during payment processing',
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
