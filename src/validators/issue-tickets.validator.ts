import { z } from 'zod';

// UTILS //
import { isValidPhoneNumber } from '@/common/utils/phone.util';

/**
 * Zod Schema for request body of Raise Issue API Endpoint
 */
export const raiseIssueTicketRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone_number: z
    .string()
    .min(8, 'Phone number is required')
    .max(12, 'Phone number cannot exceed 12 digits')
    .refine(isValidPhoneNumber, 'Invalid phone number format'),
  description: z.string().min(1, 'Description is required'),
});

/**
 * Zod Schema for the response of Raise Issue Ticket API Endpoint
 */
export const IssueTicketSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone_number: z.string(),
  description: z.string(),
  created_at: z.string(),
});