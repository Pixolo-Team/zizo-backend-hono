import { z } from 'zod';

export const getPlayersQuerySchema = z.object({
  organizationId: z.string().min(1, { message: 'organizationId is required' }),
  ageGroup: z.string().trim().min(1, { message: 'ageGroup cannot be empty' }).optional(),
  search: z.string().trim().min(1, { message: 'search cannot be empty' }).optional(),
  status: z.string().trim().min(1, { message: 'status cannot be empty' }).optional(),
});

export const playerListItemSchema = z.object({
  playerId: z.string(),
  name: z.string(),
  profilePhotoUrl: z.string().nullable(),
  organizationId: z.string(),
  identificationCode: z.string().nullable(),
  status: z.string().nullable(),
});

export type GetPlayersQuery = z.infer<typeof getPlayersQuerySchema>;
export type PlayerListItemResponse = z.infer<typeof playerListItemSchema>;
