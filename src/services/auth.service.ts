// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { VerifyOtpResponse } from '@/models/auth.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Verify a user's OTP using Supabase Auth
 * @param phone_number - The phone number used for OTP authentication
 * @param otp - The OTP received by the user
 * @returns QueryResponseData containing user and session on success, or an error
 */
export const verifyOtpService = async (
  phone_number: string,
  otp: string
): Promise<QueryResponseData<VerifyOtpResponse>> => {
  try {
    // Call Supabase OTP verification
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone_number,
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
