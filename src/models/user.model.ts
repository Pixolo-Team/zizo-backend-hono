/**
 * Example User model/type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation DTO
 */
export interface CreateUserDto {
  email: string;
  name: string;
}

/**
 * User update DTO
 */
export interface UpdateUserDto {
  email?: string;
  name?: string;
}
