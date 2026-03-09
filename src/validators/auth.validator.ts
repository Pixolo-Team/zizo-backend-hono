import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod schema for the request body of the Check User by Phone endpoint
 */
export const checkUserByPhoneSchema = z.object({
  phone_number: z
    .string()
    .min(1, 'phone_number is required')
    .refine(isValidPhoneNumber, 'phone_number must be a valid phone number'),
});

/**
 * Inferred TypeScript type from the check-by-phone Zod schema
 */
export type CheckUserByPhoneRequest = z.infer<typeof checkUserByPhoneSchema>;
