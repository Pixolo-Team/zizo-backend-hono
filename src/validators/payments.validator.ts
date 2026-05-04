import { z } from 'zod';

export const subscriptionAllocationSchema = z.object({
  subscriptionplanId: z.string().min(1, { message: 'Subscription plan ID is required' }),
  amount: z
    .number()
    .positive({ message: 'Allocated amount must be greater than 0' })
    .finite({ message: 'Allocated amount must be a valid number' }),
});

export const createPaymentRequestSchema = z
  .object({
    organizationId: z.string().min(1, { message: 'Organization ID is required' }),
    playerId: z.string().min(1, { message: 'Player ID is required' }),
    amount: z
      .number()
      .positive({ message: 'Amount must be greater than 0' })
      .finite({ message: 'Amount must be a valid number' }),
    currency: z
      .string()
      .trim()
      .min(1, { message: 'Currency cannot be empty' })
      .transform((value) => value.toUpperCase())
      .optional()
      .default('INR'),
    paymentMode: z.enum(['cash', 'upi', 'card', 'bank_transfer']),
    paymentType: z.enum(['academy_fees', 'tournament_fee', 'equipment_fee']),
    subscriptionAllocations: z.array(subscriptionAllocationSchema).optional(),
    proofUrl: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().trim().min(1, { message: 'Proof URL cannot be empty' }).optional()
    ),
    transactionReference: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().trim().min(1, { message: 'Transaction reference cannot be empty' }).optional()
    ),
    notes: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().trim().min(1, { message: 'Notes cannot be empty' }).optional()
    ),
  })
  .superRefine((value, ctx) => {
    const allocations = value.subscriptionAllocations ?? [];

    if (allocations.length === 0) {
      return;
    }

    const uniquePlanIds = new Set<string>();
    let allocatedTotal = 0;

    allocations.forEach((allocation, index) => {
      allocatedTotal += allocation.amount;

      if (uniquePlanIds.has(allocation.subscriptionplanId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate subscription plan allocation is not allowed',
          path: ['subscriptionAllocations', index, 'subscriptionplanId'],
        });
      }

      uniquePlanIds.add(allocation.subscriptionplanId);
    });

    if (allocatedTotal > value.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Total subscription allocation cannot exceed payment amount',
        path: ['subscriptionAllocations'],
      });
    }
  });

export const paymentLinkedSubscriptionSchema = z.object({
  subscriptionPlanId: z.string(),
  allocatedAmount: z.number(),
});

export const paymentResponseSchema = z.object({
  paymentId: z.string(),
  playerId: z.string(),
  amount: z.number(),
  currency: z.string(),
  paymentType: z.enum(['academy_fees', 'tournament_fee', 'equipment_fee']),
  paymentMode: z.enum(['cash', 'upi', 'card', 'bank_transfer']),
  subscriptionsLinked: z.array(paymentLinkedSubscriptionSchema),
  status: z.string(),
});

export type CreatePaymentRequest = z.infer<typeof createPaymentRequestSchema>;
export type PaymentResponseData = z.infer<typeof paymentResponseSchema>;
