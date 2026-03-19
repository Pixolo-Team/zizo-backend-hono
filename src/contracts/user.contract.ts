// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { checkUserByPhoneSchema, checkByPhoneDataSchema } from '@/validators/user.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * Route definition for POST /users/check-by-phone
 */
export const checkUserByPhoneRoute = createRoute({
  method: 'post',
  path: '/users/check-by-phone',
  tags: ['Users'],
  summary: 'Check if a user exists by phone number',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: checkUserByPhoneSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'User found or not found',
      content: {
        'application/json': {
          schema: apiResponseSchema(checkByPhoneDataSchema),
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
