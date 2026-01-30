import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { config } from '@/config';
import { logger } from '@/utils';
import { errorHandler, requestLogger } from '@/middlewares';
import routes from '@/routes';

/**
 * Initialize Hono application
 */
const app = new Hono();

/**
 * Global Middlewares
 */
app.use('*', errorHandler);
app.use('*', requestLogger);
app.use(
  '*',
  cors({
    origin: '*', // Configure this based on environment
    credentials: true,
  })
);

/**
 * Register routes
 */
app.route('/', routes);

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
