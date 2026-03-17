import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';


 /**
  * Zod Schema for request body of Verify OTP API Endpoint
  */
export const verifyOtpRequestSchema = z.object({
  phone_number: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(12, 'Phone number cannot exceed 12 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  });

 /**
 * Zod Schema for request body of Login API Endpoint
 */
export const loginRequestSchema = z.object({
  phone_number: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(12, 'Phone number cannot exceed 12 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
});
/** 
 * Zod Schema for user object in Verify OTP response
*/
export const verifyOtpUserSchema = z.record(z.string(), z.unknown());

/**
 * Zod Schema for session object in Verify OTP response
 */
export const verifyOtpSessionSchema = z.record(z.string(), z.unknown());

/**
 * Zod Schema for the response of Verify OTP API Endpoint
 */
export const verifyOtpResponseSchema = z.object({
  user: verifyOtpUserSchema.nullable(),
  session: verifyOtpSessionSchema.nullable(),
});

/**
 * Zod Schema for the response of Login API Endpoint
 */
export const loginResponseSchema = z.object({
  message: z.string(),
});

