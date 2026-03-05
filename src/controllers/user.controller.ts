// HONO //
import { Context } from 'hono';

// SERVICES //
import { userService } from '@/services';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

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
      // Get the ID from Request
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      // Fetch the User
      const user = await userService.getUserById(validatedId.id);

      // If User does not exist
      if (!user) {
        return errorResponse(
          c,
          ERROR_MESSAGES.NOT_FOUND,
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Success
      return successResponse(c, user);
    } catch (error) {
      // Any other Error
      if (error instanceof Error) {
        return errorResponse(c, error.message, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(
        c,
        ERROR_MESSAGES.BAD_REQUEST,
        ERROR_MESSAGES.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  /**
   * Create new user
   * POST /users
   */
  async createUser(c: Context) {
    try {
      // Get Post data from Request
      const body = await c.req.json();
      const validatedData = createUserSchema.parse(body);

      // Create the User in the Database
      const user = await userService.createUser(validatedData);
      return successResponse(c, user, SUCCESS_MESSAGES.CREATED, HTTP_STATUS.CREATED);
    } catch (error) {
      // Any other Errors
      if (error instanceof Error) {
        return errorResponse(c, error.message, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(
        c,
        ERROR_MESSAGES.BAD_REQUEST,
        ERROR_MESSAGES.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  /**
   * Update user
   * PUT /users/:id
   */
  async updateUser(c: Context) {
    try {
      // Get the ID from the Request & Validate
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      // Get the Request data from the body & Validate
      const body = await c.req.json();
      const validatedData = updateUserSchema.parse(body);

      // Update the User in the Database
      const user = await userService.updateUser(validatedId.id, validatedData);

      // If User update failed
      if (!user) {
        return errorResponse(
          c,
          ERROR_MESSAGES.NOT_FOUND,
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Successful User Update
      return successResponse(c, user, SUCCESS_MESSAGES.UPDATED);
    } catch (error) {
      // Any other Error
      if (error instanceof Error) {
        return errorResponse(c, error.message, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(
        c,
        ERROR_MESSAGES.BAD_REQUEST,
        ERROR_MESSAGES.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  /**
   * Delete user
   * DELETE /users/:id
   */
  async deleteUser(c: Context) {
    try {
      // Get the User ID from the request & Validate
      const id = c.req.param('id');
      const validatedId = userIdSchema.parse({ id });

      // Delete the User in the Database
      const deleted = await userService.deleteUser(validatedId.id);

      // Is User delete faield
      if (!deleted) {
        return errorResponse(
          c,
          ERROR_MESSAGES.NOT_FOUND,
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // If User deleted successfuly
      return successResponse(c, deleted, SUCCESS_MESSAGES.DELETED, HTTP_STATUS.OK);
    } catch (error) {
      // Any other Error
      if (error instanceof Error) {
        return errorResponse(c, error.message, error.message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(
        c,
        ERROR_MESSAGES.BAD_REQUEST,
        ERROR_MESSAGES.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
}

export const userController = new UserController();
