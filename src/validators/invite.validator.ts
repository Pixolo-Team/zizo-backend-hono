import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod Schema for request body of Create Invite API Endpoint
 */
export const createInviteRequestSchema = z.object({
  phone_number: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(12, 'Phone number cannot exceed 12 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
  organization_id: z.string().min(1, 'Organization ID is required'),
  membership_role_id: z.string().min(1, 'Membership role ID is required'),
  auth_id: z.string().nullable().optional(),
});

/**
 * Zod Schema for the response of Create Invite API Endpoint
 */
export const InviteSchema = z.object({
  invite_id: z.string(),
  auth_id: z.string().nullable(),
  phone_number: z.string(),
});
