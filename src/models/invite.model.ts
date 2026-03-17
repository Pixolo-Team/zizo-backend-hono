/**
 * Invite entity returned from the database
 */
export interface Invite {
  id: string;
  auth_id: string | null;
  phone_number: string;
  member_role_id: string;
  is_pending: boolean;
  invited_by: string ;
  organization_id: string;
  organization_type: string;
  created_on: string;
  updated_on: string | null;
}

/**
 * Data required to insert a new Organization_invite row
 */
export interface CreateInviteDto {
  auth_id: string | null;
  phone_number: string;
  member_role_id: string;
  invited_by: string;
  organization_id: string;
}

/**
 * Subset of Invite data returned in the API response on creation
 */
export interface CreateInviteResponse {
  invite_id: string;
  auth_id: string | null;
  phone_number: string;
}
