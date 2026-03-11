// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// CONTROLLERS //
import { userController } from '@/controllers';
import { authController } from '@/controllers/auth.controller';

// VALIDATORS //
import { checkUserByPhoneSchema } from '@/validators/auth.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

/**
 * User Routes
 * Base path: /users
 */

// GET /users - Get all users
openapiApp.get('/', (c) => userController.getAllUsers(c));

// GET /users/:id - Get user by ID
openapiApp.get('/:id', (c) => userController.getUserById(c));

// POST /users - Create new user
openapiApp.post('/', (c) => userController.createUser(c));

// PUT /users/:id - Update user
openapiApp.put('/:id', (c) => userController.updateUser(c));

// DELETE /users/:id - Delete user
openapiApp.delete('/:id', (c) => userController.deleteUser(c));

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

// Route definition for POST /users/check-by-phone
const checkUserByPhoneRoute = createRoute({
  method: 'post',
  path: '/users/check-by-phone',
  tags: ['Users'],
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

// POST /users/check-by-phone
openapiApp.openapi(checkUserByPhoneRoute, (c) => authController.checkUserByPhone(c));

