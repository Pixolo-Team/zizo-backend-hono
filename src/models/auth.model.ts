// SUPABASE //
import type { Session, User } from '@supabase/supabase-js';

/**
 * Request body for the Verify OTP endpoint
 */
export interface VerifyOtpRequest {
  phone_number: string;
  otp: string;
}

/**
 * Response data returned when OTP verification succeeds
 */
export interface VerifyOtpResponse {
  user: User | null;
  session: Session | null;
}
