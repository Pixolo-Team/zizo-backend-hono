import { Context } from 'hono';
import { successResponse } from '@/utils';

/**
 * Health Controller - Handles health check endpoints
 */
export class HealthController {
  /**
   * Health check endpoint
   * GET /health
   */
  async healthCheck(c: Context) {
    return successResponse(c, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}

export const healthController = new HealthController();
