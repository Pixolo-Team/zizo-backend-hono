// ZOD
import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod schema for a single Invite item in the response
 */
export const InviteResponseSchema = z.object({
  id: z.string(),
  phone_number: z.string(),
  invite_fields: z
    .object({
      organization_id: z.string().nullable().optional(),
      membership_role_id: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  is_pending: z.boolean(),
  invited_by: z.string(),
  organization_id: z.string(),
  created_on: z.string(),
  organization: z.object({ name: z.string() }).nullable().optional(),
  membership_role: z.object({ role_name: z.string() }).nullable().optional(),
})

/**
 * TypeScript type inferred from the InviteResponseSchema
 */
export type InviteResponse = z.infer<typeof InviteResponseSchema>;

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
  auth_id: z.preprocess((val) => (val === '' ? null : val), z.string().nullable().optional()),
});

/**
 * Zod Schema for the response of Create Invite API Endpoint
 */
export const InviteSchema = z.object({
  invite_id: z.string(),
  auth_id: z.string().nullable(),
  phone_number: z.string(),
});
