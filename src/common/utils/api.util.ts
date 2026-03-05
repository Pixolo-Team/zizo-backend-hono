// HONO //
import type { Context } from 'hono';

// TYPES //
import type { ApiResponseData } from '@/common/types/api.response.type.js';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';
import { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Send success response
 */
export const successResponse = <T = unknown>(
  c: Context,
  data: T | null = null,
  message: string = 'Success',
  statusCode: ContentfulStatusCode = HTTP_STATUS.OK
) => {
  const response: ApiResponseData<T> = {
    status: true,
    status_code: statusCode,
    message,
    data,
    error: null,
  };
  return c.json(response, statusCode);
};

/**
 * Send error response
 */
export const errorResponse = (
  c: Context,
  error: string,
  message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  statusCode: ContentfulStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
) => {
  const response: ApiResponseData<null> = {
    status: false,
    status_code: statusCode,
    message,
    data: null,
    error,
  };
  return c.json(response, statusCode);
};
