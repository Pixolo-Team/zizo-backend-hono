import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { apiResponseSchema } from '@/validators/api-response.schema';
import { getPlayersQuerySchema, playerListItemSchema } from '@/validators/players.validator';

export const getPlayersRoute = createRoute({
  method: 'get',
  path: '/players',
  tags: ['Players'],
  summary: 'Fetch organization players for an admin or manager',
  middleware: [authMiddleware] as const,
  security: [{ bearerAuth: [] }],
  request: {
    query: getPlayersQuerySchema,
  },
  responses: {
    200: {
      description: 'Players fetched successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.array(playerListItemSchema)),
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
      description: 'Forbidden',
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
