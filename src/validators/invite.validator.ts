import { z } from 'zod';

/**
 * Zod schema for the POST /invites/get-user-invites request body
 */
export const getUserInvitesRequestSchema = z.object({
  auth_id: z.string().min(1, 'auth_id is required'),
});

/**
 * Zod schema for a single invite item in the response
 */
export const InviteResponseSchema = z.object({
  invite_id: z.string(),
  phone_number: z.string(),
  organization_id: z.string(),
  organization_name: z.string(),
  role_id: z.string(),
  role_name: z.string(),
  invite_fields: z.object({
    organization_id: z.string(),
    membership_role_id: z.string(),
  }),
  is_pending: z.boolean(),
  invited_by: z.string(),
  created_on: z.string(),
});
