// Coaches Table
export interface Coach {
  id: string;
  name: string;
  email: string;
  created_at?: string | null;
}

// CREATE COACH
export interface CoachCreateData {
  name: string;
  email: string;
}
