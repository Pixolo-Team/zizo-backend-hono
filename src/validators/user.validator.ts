import { z } from 'zod';

/**
 * User validation schemas
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});
