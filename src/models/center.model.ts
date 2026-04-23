/**
 * Center entity returned from the database
 */
export interface Center {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization_id: string;
}

/**
 * Data required to create a Center in database
 */
export interface CreateCenterDto {
  name: string;
  location: string;
  city: string;
  state: string;
  country: string;
  organization_id?: string;
  is_active?: boolean;
}
