/**
 * Generic response wrapper returned by all service functions.
 */
export interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}
