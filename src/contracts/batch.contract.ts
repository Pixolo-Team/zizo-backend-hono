// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { apiResponseSchema } from '@/validators/api-response.schema';
import {
  batchParamsSchema,
  batchSchema,
  createBatchRequestSchema,
  editBatchRequestSchema,
} from '@/validators/batch.validator';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * Route definition for POST /batch/create
 */
export const createBatchRoute = createRoute({
  method: 'post',
  path: '/batch/create',
  tags: ['Batches'],
  summary: 'Create a new Batch',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createBatchRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Batch created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(batchSchema),
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
      description: 'Center, Venue, Coach users, or Players not found',
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
 * Route definition for PATCH /batch/edit/{batch_id}
 */
export const editBatchRoute = createRoute({
  method: 'patch',
  path: '/batch/edit/{batch_id}',
  tags: ['Batches'],
  summary: 'Edit an existing Batch',
  middleware: [authMiddleware] as const,
  request: {
    params: batchParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: editBatchRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Batch updated successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(batchSchema),
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
      description: 'Batch, Center, Venue, Coach users, or Players not found',
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
