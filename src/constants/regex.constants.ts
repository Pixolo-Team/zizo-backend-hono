/**
 * Regular expression for validating phone numbers (E.164 format or common formats)
 */
export const PHONE_REGEX: RegExp = /^\+?[1-9]\d{6,14}$/;
