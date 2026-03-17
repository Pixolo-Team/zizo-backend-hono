// HONO //
import { Context } from 'hono';

// SERVICES //
import { userService, checkUserByPhoneService } from '@/services';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/api';

// VALIDATIONS //
import { createUserSchema, updateUserSchema, userIdSchema, checkUserByPhoneSchema } from '@/validators';


/**
 * User Controller - Handles HTTP requests for User operations
 */
export class UserController {
  /**
   * Get all Users
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

      // Is User delete failed
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
    /**
   * Check whether a user exists in the Users table by phone number
   * POST: /users/check-by-phone
   */
  async checkUserByPhone(c: Context) {
    try {
      // Parse and validate the request body
      const body = await c.req.json();
      const parsed = checkUserByPhoneSchema.safeParse(body);

      // Return 422 if validation fails
      if (!parsed.success) {
        const parseError = parsed.error.issues[0]?.message ?? 'Validation failed';
        return errorResponse(
          c,
          parseError,
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      // Call service layer with validated phone number
      const { data, error } = await checkUserByPhoneService(parsed.data.phone_number);

      // Service-level error (Supabase failure or unexpected runtime error)
      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Determine message based on existence result
      const message = data?.exists ? 'User found' : 'User not found';
      return successResponse(c, data, message, HTTP_STATUS.OK);
    } catch (err) {
      // Catch unexpected errors (e.g. malformed JSON body)
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(
        c,
        message,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const userController = new UserController();
