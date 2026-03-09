/**
 * Response when user is found by phone number
 */
export interface CheckUserByPhoneFound {
  exists: true;
  id: string;
  first_name: string;
  last_name: string;
}

/**
 * Response when user is not found by phone number
 */
export interface CheckUserByPhoneNotFound {
  exists: false;
}

/**
 * Union type for the check-user-by-phone service result
 */
export type CheckUserByPhoneResult = CheckUserByPhoneFound | CheckUserByPhoneNotFound;
