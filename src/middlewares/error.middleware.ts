import { Context, Next } from 'hono';
import { errorResponse } from '@/utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants';
import { logger } from '@/utils';

/**
 * Global error handling middleware
 */
export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    logger.error('Unhandled error:', error);

    if (error instanceof Error) {
      return errorResponse(c, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return errorResponse(
      c,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
