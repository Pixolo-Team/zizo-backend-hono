// CONTRACTS //
import { checkUserByPhoneRoute } from '@/contracts/user.contract';

// CONTROLLERS //
import { userController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

/**
 * User Routes
 * Base path: /users
 */

// GET /users - Get all Users
openapiApp.get('/', (c) => userController.getAllUsers(c));

// GET /users/:id - Get User by ID
openapiApp.get('/:id', (c) => userController.getUserById(c));

// POST /users - Create new User
openapiApp.post('/', (c) => userController.createUser(c));

// PUT /users/:id - Update User
openapiApp.put('/:id', (c) => userController.updateUser(c));

// DELETE /users/:id - Delete User
openapiApp.delete('/:id', (c) => userController.deleteUser(c));

// POST /users/check-by-phone
openapiApp.openapi(checkUserByPhoneRoute, (c) => userController.checkUserByPhone(c));
