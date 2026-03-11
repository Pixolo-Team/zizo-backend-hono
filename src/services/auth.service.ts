// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { CheckUserByPhoneResult } from '@/models/auth.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Check whether a user exists in the Users table by phone number
 */
export const checkUserByPhoneService = async (
  phoneNumber: string
): Promise<QueryResponseData<CheckUserByPhoneResult>> => {
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
};