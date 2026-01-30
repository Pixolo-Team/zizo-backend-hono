
// DEFINITION OF RESPONSE DATA //
export type QueryResponseData<T> = {
  data: T | null
  error: Error | null
}