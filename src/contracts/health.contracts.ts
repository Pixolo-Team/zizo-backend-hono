import { ApiRoutes } from "@/constants/routes.constants";
import { createRoute } from "@hono/zod-openapi";
import { any } from "zod";

/**
 * Health Routes
 * Base path: /health
 */
export const healthCheckRoute = createRoute({
  method: 'get',
  path: ApiRoutes.HEALTH_CHECK,
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
