import { z } from 'zod';

const positiveCurrencySchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.literal('INR', { message: 'Currency must be INR' }))
  .default('INR');

export const createSubscriptionPlanRequestSchema = z.object({
  organizationId: z.string().uuid({ message: 'Organization ID must be a valid UUID' }),
  centerId: z.string().uuid({ message: 'Center ID must be a valid UUID' }),
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),
  description: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .trim()
      .max(500, { message: 'Description must be at most 500 characters long' })
      .optional()
  ),
  feeAmount: z
    .number()
    .positive({ message: 'Fee amount must be greater than 0' })
    .finite({ message: 'Fee amount must be a valid number' }),
  currency: positiveCurrencySchema,
  billingCycle: z.enum(['monthly', 'quarterly', 'annually']),
  daysPerWeek: z
    .number()
    .int({ message: 'Days per week must be an integer' })
    .min(1, { message: 'Days per week must be at least 1' })
    .max(6, { message: 'Days per week must be at most 6' }),
  durationInMonths: z
    .number()
    .int({ message: 'Duration in months must be an integer' })
    .min(1, { message: 'Duration in months must be at least 1' })
    .max(60, { message: 'Duration in months must be at most 60' }),
  isActive: z.boolean().default(true),
  organization_member_id: z.never().optional(),
  organizationMemberId: z.never().optional(),
});

export const subscriptionPlanResponseSchema = z.object({
  subscriptionPlanId: z.string(),
  organizationId: z.string(),
  centerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  feeAmount: z.number(),
  currency: z.literal('INR'),
  billingCycle: z.enum(['monthly', 'quarterly', 'annually']),
  daysPerWeek: z.number(),
  durationInMonths: z.number(),
  isActive: z.boolean(),
});

export type CreateSubscriptionPlanRequestSchema = z.infer<typeof createSubscriptionPlanRequestSchema>;
export type SubscriptionPlanResponseSchema = z.infer<typeof subscriptionPlanResponseSchema>;
