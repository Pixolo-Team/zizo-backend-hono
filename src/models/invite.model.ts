// TYPES //

/**
 * Shape of the invite_fields JSON column
 */
export interface InviteFields {
  organization_id: string;
  membership_role_id: string;
}

/**
 * Raw row returned from the invites table
 */
export interface Invite {
  id: string;
  auth_id: string;
  phone_number: string;
  invite_fields: InviteFields;
  is_pending: boolean;
  invited_by: string;
  organization_id: string;
  created_on: string;
}

/**
 * Enriched invite response returned to the client
 */
export interface InviteResponse {
  invite_id: string;
  phone_number: string;
  organization_id: string;
  organization_name: string;
  role_id: string;
  role_name: string;
  invite_fields: InviteFields;
  is_pending: boolean;
  invited_by: string;
  created_on: string;
}
