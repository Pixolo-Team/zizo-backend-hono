import { z } from 'zod';

/**
 * Zod schema for Session member input
 */
export const sessionMemberSchema = z
  .object({
    organization_member_id: z.string().min(1, { message: 'Organization member ID is required' }),
    session_role: z.enum(['coach', 'asst']),
  })
  .strict();

/**
 * Zod schema for Session route params
 */
export const sessionParamsSchema = z.object({
  id: z.string().min(1, { message: 'Session ID is required' }),
});

/**
 * Zod schema for creating a Session
 */
export const createSessionRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Session name is required' }),
    date: z.string().min(1, { message: 'Session date is required' }),
    start_time: z.string().min(1, { message: 'Start time is required' }),
    end_time: z.string().min(1, { message: 'End time is required' }),
    reporting_time: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    batch_id: z.string().min(1, { message: 'Batch ID is required' }),
    venue_id: z.string().min(1, { message: 'Venue ID is required' }),
    session_type: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    status: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    session_members: z.array(sessionMemberSchema).min(1, { message: 'At least one coach is required' }),
  })
  .refine((data) => new Set(data.session_members.map((item) => item.organization_member_id)).size === data.session_members.length, {
    message: 'Duplicate coach members are not allowed',
    path: ['session_members'],
  })
  .strict();

/**
 * Zod schema for editing a Session
 */
export const editSessionRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Session name is required' }).optional(),
    date: z.string().min(1, { message: 'Session date is required' }).optional(),
    start_time: z.string().min(1, { message: 'Start time is required' }).optional(),
    end_time: z.string().min(1, { message: 'End time is required' }).optional(),
    reporting_time: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    batch_id: z.string().min(1, { message: 'Batch ID is required' }).optional(),
    venue_id: z.string().min(1, { message: 'Venue ID is required' }).optional(),
    session_type: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    status: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    session_members: z.array(sessionMemberSchema).min(1, { message: 'At least one coach is required' }).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.date !== undefined ||
      data.start_time !== undefined ||
      data.end_time !== undefined ||
      data.reporting_time !== undefined ||
      data.batch_id !== undefined ||
      data.venue_id !== undefined ||
      data.session_type !== undefined ||
      data.status !== undefined ||
      data.session_members !== undefined,
    {
      message: 'At least one editable field is required',
      path: ['name'],
    }
  )
  .refine(
    (data) =>
      !data.session_members ||
      new Set(data.session_members.map((item) => item.organization_member_id)).size ===
        data.session_members.length,
    {
      message: 'Duplicate coach members are not allowed',
      path: ['session_members'],
    }
  )
  .strict();

/**
 * Zod schema for Session response
 */
export const sessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  batch_id: z.string(),
  venue_id: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  session_template_id: z.number().nullable(),
  session_type: z.string(),
  reporting_time: z.string().nullable(),
  name: z.string(),
  organization_id: z.string(),
});
