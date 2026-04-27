// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { apiResponseSchema } from '@/validators/api-response.schema';
import {
  createSessionRequestSchema,
  editSessionRequestSchema,
  sessionParamsSchema,
  sessionSchema,
} from '@/validators/session.validator';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * Route definition for POST /session/create
 */
export const createSessionRoute = createRoute({
  method: 'post',
  path: '/session/create',
  tags: ['Sessions'],
  summary: 'Create a new Session',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createSessionRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Session created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(sessionSchema),
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
    404: {
      description: 'Batch, Venue, or Session members not found',
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
 * Route definition for PATCH /session/edit/{id}
 */
export const editSessionRoute = createRoute({
  method: 'patch',
  path: '/session/edit/{id}',
  tags: ['Sessions'],
  summary: 'Edit an existing Session',
  middleware: [authMiddleware] as const,
  request: {
    params: sessionParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: editSessionRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Session updated successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(sessionSchema),
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
    404: {
      description: 'Session, Batch, Venue, or Session members not found',
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
