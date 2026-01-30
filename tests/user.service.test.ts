import { describe, it, expect } from 'vitest';
import { UserService } from '@/services/user.service';

describe('UserService', () => {
  const userService = new UserService();

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await userService.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const user = await userService.createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', userData.email);
      expect(user).toHaveProperty('name', userData.name);
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });
  });

  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      const user = await userService.getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });
});
