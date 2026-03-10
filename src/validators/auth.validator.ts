import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod schema for the request body of the Check User by Phone endpoint
 */
export const checkUserByPhoneSchema = z.object({
  phone_number: z
    .string()
    .min(8, 'Phone number is required')
    .max(12, 'Phone number cannot exceed 12 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
});

/**
 * Inferred TypeScript type from the check-by-phone Zod schema
 */
export type CheckUserByPhoneRequest = z.infer<typeof checkUserByPhoneSchema>;
