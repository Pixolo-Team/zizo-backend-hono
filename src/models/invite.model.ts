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

/**
 * Error codes returned by the respond-to-invite service
 */
export type InviteActionErrorCode = 'NOT_FOUND' | 'FORBIDDEN' | 'CONFLICT';

/**
 * Data transfer object for responding to an invite
 */
export interface RespondToInviteDto {
  organization_invite_id: string;
  action: 'accept' | 'reject';
  auth_id: string;
  phone_number: string | null;
}

/**
 * Response shape for the respond-to-invite API
 */
export interface RespondToInviteResponseData {
  organization_invite_id: string;
  action: 'accept' | 'reject';
}

/**
 * Service result for the respond-to-invite operation
 * Extends QueryResponseData with an optional error code for business logic errors
 */
export interface RespondToInviteServiceResult {
  data: RespondToInviteResponseData | null;
  error: Error | null;
  errorCode?: InviteActionErrorCode;
}
