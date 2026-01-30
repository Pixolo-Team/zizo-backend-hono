// DEFINITION OF IDENTITY TABLE //
export type Identity = {
  id: string
  name: string
  phone: string
  first_seen_at: string
  last_seen_at: string
}

// DEFINITION OF RESPONSE DATA //
export type QueryResponseData<T> = {
  data: T | null
  error: Error | null
}