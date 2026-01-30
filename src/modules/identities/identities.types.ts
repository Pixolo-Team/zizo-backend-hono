export type Identity = {
  id: string
  created_at: string
}

export type QueryResponseData<T> = {
  data: T | null
  error: Error | null
}