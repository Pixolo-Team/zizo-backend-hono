// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { apiResponseSchema } from '@/validators/api-response.schema';
import { centerSchema, createCenterRequestSchema } from '@/validators/center.validator';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * Route definition for POST /centers/create
 */
export const createCenterRoute = createRoute({
  method: 'post',
  path: '/centers/create',
  tags: ['Centers'],
  summary: 'Create a new Center',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createCenterRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Center created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(centerSchema),
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
      description: 'Forbidden - User is not a member of any organization',
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

/**
 * Route definition for GET /centers
 */
export const getAllCentersRoute = createRoute({
  method: 'get',
  path: '/centers',
  tags: ['Centers'],
  summary: 'Get all Centers for authenticated user organization',
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      description: 'Centers fetched successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.array(centerSchema)),
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
      description: 'Forbidden - User is not a member of any organization',
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
