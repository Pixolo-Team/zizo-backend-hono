// MODELS //
import { User, CreateUserDto, UpdateUserDto, type CheckUserByPhoneResult } from '@/models';

// UTILS //
import { logger } from '@/common/utils/logger.util';
import type { QueryResponseData } from '@/common/types/query.response.type';
import { supabase } from '@/config/supabase';

/**
 * User Service - Business logic for user operations
 */
export class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    // Example: In real application, this would query the database
    logger.debug('Fetching all users');
    return [];
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    logger.debug(`Fetching user with ID: ${id}`);
    // Example: Query database for user
    return null;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    logger.debug('Creating new user', data);
    // Example: Insert into database
    const newUser: User = {
      id: '1234',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newUser;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
    logger.debug(`Updating user ${id}`, data);
    // Example: Update database record
    return null;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    logger.debug(`Deleting user ${id}`);
    // Example: Delete from database
    return true;
  }
}

/**
 * Check whether a user exists in the Users table by phone number
 */
export const checkUserByPhoneService = async (
  phoneNumber: string): Promise<QueryResponseData<CheckUserByPhoneResult>> => {
  try {

    // Query the Users table for a record matching the provided phone number
    const { data, error } = await supabase
      .from('users')
      .select('auth_id, first_name, last_name')
      .eq('phone_number', phoneNumber)
      .maybeSingle();

    // Database query failed
    if (error) {
      logger.error('Failed to query Users table:', error);
      return { data: null, error: new Error(error.message) };
    }

    // User does not exist in the Users table
    if (!data) {
      return {
        data: { exists: false },
        error: null,
      };
    }

    // User found — return relevant user details
    return {
      data: {
        exists: true,
        id: data.auth_id,
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
      },
      error: null,
    };

  } catch (err) {

    // Unexpected runtime error
    logger.error('Unexpected error in checkUserByPhoneService:', err);

    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error('Unexpected error occurred while checking user'),
    };
  }
}

export const userService = new UserService();
