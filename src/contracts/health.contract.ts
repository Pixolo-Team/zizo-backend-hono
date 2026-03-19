// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

/**
 * Route definition for GET /health
 */
export const healthCheckRoute = createRoute({
  method: 'get',
  path: `/health`,
  tags: ['Health'],
  summary: 'Get the health of the API',
  responses: {
    200: {
      description: 'If the API is working',
      content: {
        'application/json': {
          schema: z.any(),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
