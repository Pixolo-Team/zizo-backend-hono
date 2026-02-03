// Type of Response from Supabase
export interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}
