/**
 * Represents a coach entity from the database.
 */
export interface Coach {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

/**
 * Request body for creating a new coach.
 */
export interface CreateCoachBody {
  name: string;
  email: string;
}
