// API Status - using literal types for Edge compatibility
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Type for HTTP status codes used in this app
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// Error Messages
export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  VALIDATION_FAILED: 'Validation failed',
  PHONE_NOT_FOUND: 'PHONE_NOT_FOUND',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
} as const;
