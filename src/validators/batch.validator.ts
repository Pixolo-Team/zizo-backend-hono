import { z } from 'zod';

/**
 * Zod schema for creating a Batch
 */
export const createBatchRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'Batch name is required' }),
    description: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    center_id: z.string().min(1, { message: 'Center ID is required' }),
    venue_id: z.string().min(1, { message: 'Venue ID is required' }),
    head_coach_user_id: z.string().min(1, { message: 'Head Coach is required' }),
    assistant_coach_user_id: z.string().min(1, { message: 'Assistant Coach is required' }),
    player_ids: z.array(z.string().min(1)).optional(),
  })
  .refine((data) => data.head_coach_user_id !== data.assistant_coach_user_id, {
    message: 'Head Coach and Assistant Coach must be different users',
    path: ['assistant_coach_user_id'],
  })
  .refine(
    (data) =>
      !data.player_ids || new Set(data.player_ids).size === data.player_ids.length,
    {
      message: 'Duplicate players are not allowed',
      path: ['player_ids'],
    }
  )
  .strict();

/**
 * Zod schema for Batch response
 */
export const batchSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  center_id: z.string(),
  venue_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
