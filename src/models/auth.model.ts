// SUPABASE //
import type { Session, User } from '@supabase/supabase-js';


/**
 * Response when User is found by phone number
 */
export interface CheckUserByPhoneFound {
  exists: true;
  id: string;
  first_name: string;
  last_name: string;
}

/**
 * Response when User is not found by phone number
 */
export interface CheckUserByPhoneNotFound {
  exists: false;
}

/**
 * Union type for the check-user-by-phone service result
 */
export type CheckUserByPhoneResult = CheckUserByPhoneFound | CheckUserByPhoneNotFound;

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
