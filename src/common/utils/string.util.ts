/**
 * Converts a string to snake_case.
 * @param str - Input string
 * @returns snake_case string
 */
export const toSnakeCase = (str: string): string =>
  str.trim().toLowerCase().replace(/\s+/g, "_");

/**
 * Safely converts a string value to a number, returning undefined for invalid input.
 * @param value - Raw string value
 * @returns Parsed number or undefined
 */
export const toNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};
