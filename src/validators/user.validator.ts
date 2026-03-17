import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

// Create User Validation
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

// Update User Validation
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

// Schema for a found-user response body
const checkByPhoneFoundSchema = z.object({
  exists: z.literal(true),
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

// Schema for a not-found response body
const checkByPhoneNotFoundSchema = z.object({
  exists: z.literal(false),
});

// Union response data schema
export const checkByPhoneDataSchema = z.union([checkByPhoneFoundSchema, checkByPhoneNotFoundSchema]);


// User ID validation
export const userIdSchema = z.object({
  id: z.string(),
});

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
