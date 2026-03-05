import { healthController } from '@/controllers';
import { openapiApp } from './openapi.routes';
import { createRoute } from '@hono/zod-openapi';
import { any } from 'zod';

/**
 * Health Routes
 * Base path: /health
 */
const healthCheckRoute = createRoute({
  method: 'get',
  path: `/health`,
  tags: ['Health'],
  summary: 'Get the health of the API',
  responses: {
    200: {
      description: 'If the API is working',
      content: {
        'application/json': {
          schema: any(),
        },
      },
    },
    500: {
      description: 'List of all the Organizers',
    },
  },
});

// GET /health - Health check
openapiApp.openapi(healthCheckRoute, (c) => healthController.healthCheck(c));
