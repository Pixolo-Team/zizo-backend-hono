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
 * Invite response returned to the client (with joined organization and role data)
 */
export interface InviteResponse {
  id: string;
  phone_number: string;
  invite_fields: InviteFields | null;
  is_pending: boolean;
  invited_by: string;
  organization_id: string;
  created_on: string;
  organizations: { name: string } | null;
  membership_roles: { role_name: string } | null;
}

/**
 * JSON object stored in the Invite_fields column
 */ 
export interface InviteFields {
  organization_id?: string | null;
  membership_role_id?: string | null;
}

/**
 * Data required to insert a new Invite row
 */
export interface CreateInviteDto {
  auth_id: string | null;
  phone_number: string;
  invite_fields: InviteFields;
  invited_by: string | null;
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
