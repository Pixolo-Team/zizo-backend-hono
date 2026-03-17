// HONO //
import type { Context } from 'hono';

// TYPES //
import type { ApiResponseData } from '@/common/types/api.response.type.js';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS, type HttpStatusCode } from '@/constants/api';

/**
 * Send success response
 */
export function successResponse<T = unknown>(
  c: Context,
  data: T | null = null,
  message: string = 'Success',
  statusCode: HttpStatusCode = HTTP_STATUS.OK
) {
  const response: ApiResponseData<T> = {
    status: true,
    status_code: statusCode,
    message,
    data,
    error: null,
  };
  return c.json(response, statusCode);
}

/**
 * Send error response
 */
export function errorResponse(
  c: Context,
  error: string,
  message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
) {
  const response: ApiResponseData<null> = {
    status: false,
    status_code: statusCode,
    message,
    data: null,
    error,
  };
  return c.json(response, statusCode);
}
