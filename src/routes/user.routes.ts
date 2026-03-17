// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// CONTROLLERS //
import { userController } from '@/controllers';

// VALIDATORS //
import { checkUserByPhoneSchema } from '@/validators/user.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

/**
 * User Routes
 * Base path: /users
 */

// GET /users - Get all Users
openapiApp.get('/', (c) => userController.getAllUsers(c));

// GET /users/:id - Get User by ID
openapiApp.get('/:id', (c) => userController.getUserById(c));

// POST /users - Create new User
openapiApp.post('/', (c) => userController.createUser(c));

// PUT /users/:id - Update User
openapiApp.put('/:id', (c) => userController.updateUser(c));

// DELETE /users/:id - Delete User
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
  middleware: [authMiddleware] as const,
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
openapiApp.openapi(checkUserByPhoneRoute, (c) => userController.checkUserByPhone(c));

