// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { CheckUserByPhoneResult } from '@/models/auth.model';

// CONFIG //
import { supabaseAdmin } from '@/config/supabase';

// CONSTANTS //
import { AUTH_CONSTANTS } from '@/constants/api';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Check whether a user exists in Supabase Auth by phone number
 * @param phoneNumber - The phone number to look up in auth.users
 * @returns QueryResponseData containing the check result or an error
 */
export const checkUserByPhoneService = async (
  phoneNumber: string
): Promise<QueryResponseData<CheckUserByPhoneResult>> => {
  try {
    // Fetch users from Supabase Auth admin API (paginated)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      perPage: AUTH_CONSTANTS.ADMIN_LIST_USERS_PAGE_SIZE,
    });

    // Supabase admin query failed
    if (error) {
      logger.error('Failed to list users from Supabase Auth:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Filter to find the user whose phone matches
    const foundUser = data.users.find((user) => user.phone === phoneNumber);

    // User does not exist
    if (!foundUser) {
      return { data: { exists: false }, error: null };
    }

    // User found — extract name from user_metadata
    const meta = foundUser.user_metadata as Record<string, unknown>;
    return {
      data: {
        exists: true,
        id: foundUser.id,
        first_name: typeof meta?.first_name === 'string' ? meta.first_name : '',
        last_name: typeof meta?.last_name === 'string' ? meta.last_name : '',
      },
      error: null,
    };
  } catch (err) {
    // Unexpected runtime error
    logger.error('Unexpected error in checkUserByPhoneService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error occurred while checking user'),
    };
  }
};
