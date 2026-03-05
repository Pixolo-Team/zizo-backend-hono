import { Hono } from 'hono';
import { userController } from '@/controllers';

const userRoutes = new Hono();

/**
 * User Routes
 * Base path: /users
 */

// GET /users - Get all users
userRoutes.get('/', (c) => userController.getAllUsers(c));

// GET /users/:id - Get user by ID
userRoutes.get('/:id', (c) => userController.getUserById(c));

// POST /users - Create new user
userRoutes.post('/', (c) => userController.createUser(c));

// PUT /users/:id - Update user
userRoutes.put('/:id', (c) => userController.updateUser(c));

// DELETE /users/:id - Delete user
userRoutes.delete('/:id', (c) => userController.deleteUser(c));

export default userRoutes;
