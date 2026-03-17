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
  member_role_id: z.string(),
  is_pending: z.boolean(),
  invited_by: z.string(),
  organization_id: z.string(),
  organization_type: z.string(),
  created_on: z.string(),
  updated_on: z.string(),
  organization: z.object({ name: z.string() }).nullable().optional(),
  member_role: z.object({ name: z.string() }).nullable().optional(),
});

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
    .min(8)
    .max(12)
    .refine(isValidPhoneNumber),
  organization_id: z.string().min(1),
  member_role_id: z.string().min(1),
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
