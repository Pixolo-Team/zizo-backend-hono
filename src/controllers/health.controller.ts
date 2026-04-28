// HONO //
import { Context } from 'hono';

// SUPABASE //
import { supabase } from '@/config/supabase';

type HealthResponse = {
  ok: boolean;
  api: 'healthy' | 'unhealthy';
  db: 'healthy' | 'unhealthy';
  dbVersion?: string;
  timestamp?: string;
  error?: string;
};

/**
 * Health Controller - Handles health check endpoints
 */
export class HealthController {
  /**
   * Health check endpoint
   * GET /health
   */
  async healthCheck(c: Context) {
    try {
      try {
        const { data, error } = await supabase.rpc('health_check');

        if (error) {
          return c.json(
            {
              ok: false,
              api: 'healthy',
              db: 'unhealthy',
              error: error.message,
            } satisfies HealthResponse,
            500
          );
        }

        const dbVersion = typeof data === 'string' ? data : undefined;
        return c.json(
          {
            ok: true,
            api: 'healthy',
            db: 'healthy',
            ...(dbVersion ? { dbVersion } : {}),
            timestamp: new Date().toISOString(),
          } satisfies HealthResponse,
          200
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Database unreachable';
        return c.json(
          {
            ok: false,
            api: 'healthy',
            db: 'unhealthy',
            error: message,
          } satisfies HealthResponse,
          500
        );
      }
    } catch {
      return c.json(
        {
          ok: false,
          api: 'unhealthy',
          db: 'unhealthy',
          error: 'Internal server error',
        } satisfies HealthResponse,
        500
      );
    }
  }
}

export const healthController = new HealthController();
