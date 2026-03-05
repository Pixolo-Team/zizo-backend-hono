/**
 * Standard API Response Interface
 * @template T - The type of the data object
 */
export interface ApiResponse<T = unknown> {
  data: T | null;
  status: "success" | "error";
  status_code: number;
  message: string;
  error: string | null;
}
