/**
 * Venue entity returned from the database
 */
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  google_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  oraganization_id: string;
}

/**
 * Data required to create a Venue in database
 */
export interface CreateVenueDto {
  name: string;
  address: string;
  city: string;
  google_link?: string;
  oraganization_id?: string;
  is_active?: boolean;
}
