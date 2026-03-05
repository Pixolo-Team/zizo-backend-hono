import { Context, Next } from 'hono';
import { errorResponse } from '@/utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';
import { logger } from '@/utils';

/**
 * Global error handling middleware
 */
export const errorHandler = async (c: Context, next: Next): Promise<Response> => {
  try {
    await next();
    return c.res;
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
