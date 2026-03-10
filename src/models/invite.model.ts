/**
 * Invite entity returned from the database
 */
export interface Invite {
  id: string;
  auth_id: string | null;
  phone_number: string;
  invite_fields: InviteFields;
  is_pending: boolean;
  invited_by: string | null;
  organization_id: string;
  created_on: string;
}

/**
 * JSON object stored in the invite_fields column
 */
export interface InviteFields {
  organization_id: string | null;
  membership_role_id: string | null;
}

/**
 * Data required to insert a new invite row
 */
export interface CreateInviteDto {
  auth_id: string | null;
  phone_number: string;
  invite_fields: InviteFields;
  is_pending: boolean;
  invited_by: string | null;
  organization_id: string;
  created_on: string;
}

/**
 * Subset of Invite data returned in the API response
 */
export interface InviteResponse {
  invite_id: string;
  auth_id: string | null;
  phone_number: string;
}
