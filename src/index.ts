// HONO //
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { config } from '@/config';

// UTILS //
import { logger } from '@/common/utils/logger.util';
import { requestLogger } from '@/middlewares';

import app from '@/routes';

/**
 * Global Middlewares
 */
app.use('*', requestLogger);

// CORS
app.use(
  '*',
  cors({
    origin: config.nodeEnv === 'production' ? [] : '*', // Configure allowed origins in production
    credentials: true,
  })
);

/**
 * 404 Handler
 */
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'Route not found',
    },
    404
  );
});

/**
 * Global Error Handler
 */
app.onError((err, c) => {
  logger.error('Unhandled error:', err);
  return c.json(
    {
      success: false,
      error: err.message || 'Internal server error',
    },
    500
  );
});

/**
 * Start server
 */
const startServer = () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: config.port,
      },
      (info) => {
        logger.info(`🚀 Server running on http://localhost:${info.port}`);
        logger.info(`📝 Environment: ${config.nodeEnv}`);
        logger.info(`📡 API Base: ${config.apiPrefix}/${config.apiVersion}`);
      }
    );
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
