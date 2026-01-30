import { Context } from 'hono';
import { userService } from '@/services';
import { successResponse, errorResponse } from '@/utils';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { createUserSchema, updateUserSchema } from '@/validators';

/**
 * User Controller - Handles HTTP requests for user operations
 */
export class UserController {
  /**
   * Get all users
   * GET /users
   */
  async getAllUsers(c: Context) {
    const users = await userService.getAllUsers();
    return successResponse(c, users);
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  async getUserById(c: Context) {
    const id = c.req.param('id');
    const user = await userService.getUserById(id);

    if (!user) {
      return errorResponse(c, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return successResponse(c, user);
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
      const body = await c.req.json();
      const validatedData = updateUserSchema.parse(body);

      const user = await userService.updateUser(id, validatedData);

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
    const id = c.req.param('id');
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return errorResponse(c, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return successResponse(c, null, SUCCESS_MESSAGES.DELETED, HTTP_STATUS.NO_CONTENT);
  }
}

export const userController = new UserController();
