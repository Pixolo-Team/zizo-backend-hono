import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod Schema for request body of Login API Endpoint
 */
export const loginRequestSchema = z.object({
  phone_number: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
});

/**
 * Zod Schema for the response of Login API Endpoint
 */
export const loginResponseSchema = z.object({
  message: z.string(),
});
