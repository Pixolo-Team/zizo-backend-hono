/**
 * Coach entity returned from Supabase
 */
export interface Coach {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

/**
 * Request body for creating a coach
 */
export interface CreateCoachBody {
  name: string;
  email: string;
}
