// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { apiResponseSchema } from '@/validators/api-response.schema';
import { createVenueRequestSchema, venueSchema } from '@/validators/venue.validator';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * Route definition for POST /venues/create
 */
export const createVenueRoute = createRoute({
  method: 'post',
  path: '/venues/create',
  tags: ['Venues'],
  summary: 'Create a new Venue',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createVenueRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Venue created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(venueSchema),
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
