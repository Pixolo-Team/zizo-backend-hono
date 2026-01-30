import { Context } from 'hono';
import { HTTP_STATUS } from '@/constants';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Send success response
 */
export const successResponse = <T = unknown>(
  c: Context,
  data?: T,
  message?: string,
  status: number = HTTP_STATUS.OK
) => {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };
  return c.json(response, status as never);
};

/**
 * Send error response
 */
export const errorResponse = (
  c: Context,
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
) => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return c.json(response, status as never);
};
