/**
 * Standard API Response Interface
 * @template T - The type of the data object
 */
export interface ApiResponseData<T = unknown> {
  data: T | null;
  status: boolean;
  status_code: number;
  message: string;
  error?: string | null;
}
