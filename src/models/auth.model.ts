// SUPABASE //
import type { Session, User } from '@supabase/supabase-js';

// --- VERIFY OTP ---

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

// --- LOGIN ---

/**
 * Login request data
 */
export interface LoginRequest {
  phone_number: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  message: string;
}
