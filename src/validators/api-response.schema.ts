import { z } from 'zod';

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean(),
    status_code: z.number(),
    message: z.string().optional(),
    data: dataSchema.nullable(),
    error: z.string().nullable().optional(),
  });
