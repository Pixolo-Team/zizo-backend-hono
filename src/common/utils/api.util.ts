// HONO //
import type { Context } from 'hono';

// TYPES //
import type { ApiResponseData } from '@/common/types/api.response.type.js';

// CONSTANTS //
import { ERROR_MESSAGES, HTTP_STATUS, type ContentfulStatusCode } from '@/constants/api';

/**
 * Send success response
 */
export const successResponse = <T = unknown, S extends ContentfulStatusCode = typeof HTTP_STATUS.OK>(
  c: Context,
  data: T | null = null,
  message: string = 'Success',
  statusCode: S = HTTP_STATUS.OK as S
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
export const errorResponse = <S extends ContentfulStatusCode = typeof HTTP_STATUS.INTERNAL_SERVER_ERROR>(
  c: Context,
  error: string,
  message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  statusCode: S = HTTP_STATUS.INTERNAL_SERVER_ERROR as S
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
