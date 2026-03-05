// HONO //
import { Context } from 'hono';

// SERVICES //
import { userService } from '@/services';

// UTILS //
import { successResponse, errorResponse } from '@/utils';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/api';

// VALIDATIONS //
import { createUserSchema, updateUserSchema, userIdSchema } from '@/validators';

/**
 * User Controller - Handles HTTP requests for user operations
 */
export class UserController {
  /**
   * Get all users
   * GET: /users
   */
  async getAllUsers(c: Context) {
    // Fetch all the Users from Service
    const users = await userService.getAllUsers();
    return successResponse(c, users);
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  async getUserById(c: Context) {
    try {
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      const user = await userService.getUserById(validatedId.id);

      if (!user) {
        return errorResponse(c, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(c, user);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(c, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(c, ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Create new user
   * POST /users
   */
  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const validatedData = createUserSchema.parse(body);

      const user = await userService.createUser(validatedData);
      return successResponse(c, user, SUCCESS_MESSAGES.CREATED, HTTP_STATUS.CREATED);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(c, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(c, ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Update user
   * PUT /users/:id
   */
  async updateUser(c: Context) {
    try {
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      const body = await c.req.json();
      const validatedData = updateUserSchema.parse(body);

      const user = await userService.updateUser(validatedId.id, validatedData);

      if (!user) {
        return errorResponse(c, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(c, user, SUCCESS_MESSAGES.UPDATED);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(c, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(c, ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Delete user
   * DELETE /users/:id
   */
  async deleteUser(c: Context) {
    try {
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      const deleted = await userService.deleteUser(validatedId.id);

      if (!deleted) {
        return errorResponse(c, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      return c.body(null, HTTP_STATUS.NO_CONTENT as never);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(c, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(c, ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const userController = new UserController();
