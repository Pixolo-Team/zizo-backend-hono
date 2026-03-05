import { z } from 'zod';

// Create User Validation
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

// Update User Validation
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

// User ID validation
export const userIdSchema = z.object({
  id: z.string(),
});
