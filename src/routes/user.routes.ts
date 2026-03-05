// CONTROLLERS //
import { userController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

/**
 * User Routes
 * Base path: /users
 */

// GET /users - Get all users
openapiApp.get('/', (c) => userController.getAllUsers(c));

// GET /users/:id - Get user by ID
openapiApp.get('/:id', (c) => userController.getUserById(c));

// POST /users - Create new user
openapiApp.post('/', (c) => userController.createUser(c));

// PUT /users/:id - Update user
openapiApp.put('/:id', (c) => userController.updateUser(c));

// DELETE /users/:id - Delete user
openapiApp.delete('/:id', (c) => userController.deleteUser(c));
