// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { checkUserByPhoneSchema } from '@/validators/auth.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLERS //
import { authController } from '@/controllers/auth.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Schema for a found-user response body
const checkByPhoneFoundSchema = z.object({
  exists: z.literal(true),
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

// Schema for a not-found response body
const checkByPhoneNotFoundSchema = z.object({
  exists: z.literal(false),
});

// Union response data schema
const checkByPhoneDataSchema = z.union([checkByPhoneFoundSchema, checkByPhoneNotFoundSchema]);

// Route definition for POST /auth/check-by-phone
const checkUserByPhoneRoute = createRoute({
  method: 'post',
  path: '/auth/check-by-phone',
  tags: ['Auth'],
  summary: 'Check if a user exists by phone number',
  request: {
    body: {
      content: {
        'application/json': {
          schema: checkUserByPhoneSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'User found or not found',
      content: {
        'application/json': {
          schema: apiResponseSchema(checkByPhoneDataSchema),
        },
      },
    },
    422: {
      description: 'Validation Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
  },
});

// POST /auth/check-by-phone
openapiApp.openapi(checkUserByPhoneRoute, (c) => authController.checkUserByPhone(c));
