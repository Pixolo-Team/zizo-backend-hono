// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

const healthStatusSchema = z.enum(['healthy', 'unhealthy']);

export const healthResponseSchema = z
  .object({
    ok: z.boolean(),
    api: healthStatusSchema,
    db: healthStatusSchema,
    dbVersion: z.string().optional(),
    timestamp: z.string().optional(),
    error: z.string().optional(),
  })
  .strict();

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
          schema: healthResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: healthResponseSchema,
        },
      },
    },
  },
});
