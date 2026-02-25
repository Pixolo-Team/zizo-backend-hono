/**
 * Converts a string to snake_case.
 *
 * @example toSnakeCase("League Knockout") → "league_knockout"
 *
 * @param value - Input string to convert
 * @returns snake_case version of the input
 */
export const toSnakeCase = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
