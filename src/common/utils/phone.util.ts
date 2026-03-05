// CONSTANTS //
import { PHONE_REGEX } from '@/constants/regex.constants';

/**
 * Validates phone number format (E.164 or common formats)
 * @param phone - Phone number string
 * @returns boolean
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};
