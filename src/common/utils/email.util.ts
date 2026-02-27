// CONSTANTS //
import { EMAIL_REGEX } from "../constants/regex.constants.js";

/**
 * Validates email format
 * @param email - Email string
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
