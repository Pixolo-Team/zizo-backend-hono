import { Hono } from 'hono';
import { healthController } from '@/controllers';

const healthRoutes = new Hono();

/**
 * Health Routes
 * Base path: /health
 */

// GET /health - Health check
healthRoutes.get('/', (c) => healthController.healthCheck(c));

export default healthRoutes;
