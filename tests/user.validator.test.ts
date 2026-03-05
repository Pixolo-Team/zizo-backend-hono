import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema } from '@/validators/user.validator';

describe('User Validators', () => {
  describe('createUserSchema', () => {
    it('should validate correct user data', () => {
      const validData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'A',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        name: 'Updated Name',
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
