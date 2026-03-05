import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod schema for raising an issue ticket
 */
export const raiseIssueTicketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
  description: z.string().min(1, 'Description is required'),
});

export type RaiseIssueTicketInput = z.infer<typeof raiseIssueTicketSchema>;
