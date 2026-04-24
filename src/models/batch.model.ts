/**
 * Batch entity returned from the database
 */
export interface Batch {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  center_id: string;
  venue_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a Batch
 */
export interface CreateBatchDto {
  name: string;
  description?: string;
  center_id: string;
  venue_id: string;
  head_coach_user_id: string;
  assistant_coach_user_id: string;
  player_ids?: string[];
}
