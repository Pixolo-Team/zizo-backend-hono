// HONO //
import { cors } from 'hono/cors';

// CONFIG //
import { config } from '@/config';

// UTILS //
import { logger } from '@/common/utils/logger.util';
import { requestLogger } from '@/middlewares';

// ROUTES //
import app from '@/routes';

/**
 * Global Middlewares
 */
app.use('*', requestLogger);

// CORS
app.use(
  '*',
  cors({
    origin: config.nodeEnv === 'production' ? [] : '*',
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

export default app;
