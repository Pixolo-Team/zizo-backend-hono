// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { VerifyOtpResponse, LoginRequest, LoginResponse } from '@/models/auth.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// CONSTANTS //
import { ERROR_MESSAGES } from '@/constants/api';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Verify a User's OTP using Supabase Auth
 */
export const verifyOtpService = async (
  phoneNumber: string,
  otp: string
): Promise<QueryResponseData<VerifyOtpResponse>> => {
  try {

    // Call Supabase OTP verification
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms',
    });

    // OTP verification failed - invalid or expired token
    if (error) {
      logger.error('OTP verification failed:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Return the user and session from the Supabase response
    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  } catch (err) {

    // Unexpected service error
    logger.error('Unexpected error in verifyOtpService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};

/**
 * Checks if a phone number exists in the Users or Invites table, then sends OTP
 */
export const loginService = async (
  loginDto: LoginRequest
): Promise<QueryResponseData<LoginResponse>> => {
  try {
    const { phone_number: phoneNumber } = loginDto;

    // Check if phone number exists in the users table
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('phone_number')
      .eq('phone_number', phoneNumber)
      .limit(1)
      .maybeSingle();

    if (userError) {

      // Unexpected database error querying Users table
      logger.error('Error querying users table:', userError);
      return { data: null, error: new Error(userError.message) };
    }

    // If not found in Users, check the Invites table
    if (!userRecord) {
      const { data: inviteRecord, error: inviteError } = await supabase
        .from('invites')
        .select('phone_number')
        .eq('phone_number', phoneNumber)
        .limit(1)
        .maybeSingle();

      // Unexpected database error querying Invites table
      if (inviteError) {
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
      phone: phoneNumber,
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
