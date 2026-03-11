// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { LoginRequest, LoginResponse } from '@/models/auth.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// CONSTANTS //
import { ERROR_MESSAGES } from '@/constants/api';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Checks if a phone number exists in the users or invites table, then sends OTP
 * @param loginDto - Login request data containing phone_number
 * @returns QueryResponseData with LoginResponse on success or error
 */
export const loginService = async (
  loginDto: LoginRequest
): Promise<QueryResponseData<LoginResponse>> => {
  try {
    const { phone_number } = loginDto;

    // Check if phone number exists in the users table
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('phone_number')
      .eq('phone_number', phone_number)
      .maybeSingle();

    if (userError) {
      // Unexpected database error querying users table
      logger.error('Error querying users table:', userError);
      return { data: null, error: new Error(userError.message) };
    }

    // If not found in users, check the invites table
    if (!userRecord) {
      const { data: inviteRecord, error: inviteError } = await supabase
        .from('invites')
        .select('phone_number')
        .eq('phone_number', phone_number)
        .maybeSingle();

      if (inviteError) {
        // Unexpected database error querying invites table
        logger.error('Error querying invites table:', inviteError);
        return { data: null, error: new Error(inviteError.message) };
      }

      // Phone number not found in either table
      if (!inviteRecord) {
        return { data: null, error: new Error(ERROR_MESSAGES.PHONE_NOT_FOUND) };
      }
    }

    // Phone number found — send OTP via Supabase Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: phone_number,
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      // OTP dispatch failed
      logger.error('Error sending OTP:', otpError);
      return { data: null, error: new Error(otpError.message) };
    }

    return { data: { message: 'OTP sent successfully' }, error: null };
  } catch (err) {
    // Unexpected service error — request did not reach the database
    logger.error('Unexpected error in loginService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
