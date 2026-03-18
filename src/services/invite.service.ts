// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Invite, CreateInviteDto, CreateInviteResponse, RespondToInviteDto, RespondToInviteServiceResult } from '@/models/invite.model';
import type { InviteResponse } from '@/validators/invite.validator';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Fetch all pending Organization_invites for a User by phone_number.
 */
export const getUserInvitesService = async (
  phoneNumber: string
): Promise<QueryResponseData<InviteResponse[]>> => {
  try {
    // Fetch pending Organization_invites with Organization data
    const { data: invites, error: invitesError } = await supabase
      .from('organization_invites')
      .select(`
        id,
        phone_number,
        member_role_id,
        is_pending,
        invited_by,
        organization_id,
        organization_type,
        created_on,
        updated_on,
        organization:organizations ( name ),
        member_role:member_roles ( id, name )
      `)
      .eq('phone_number', phoneNumber)
      .eq('is_pending', true);

    // Database error while fetching Organization_invites
    if (invitesError) {
      logger.error('Failed to fetch Organization_Invites:', invitesError);
      return { data: null, error: new Error(invitesError.message) };
    }

    // No pending Organization_invites found
    if (!invites || invites.length === 0) {
      return { data: [], error: null };
    }

    return { data: invites as InviteResponse[], error: null };
  } catch (err) {
    // Unexpected service error - request did not reach the database
    logger.error('Unexpected error in getUserInvitesService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};

 
/**
*  Insert a new Invite into the database
*/   
export const createInviteService = async (
  inviteDto: CreateInviteDto
): Promise<QueryResponseData<CreateInviteResponse>> => {
  try {
    // Insert the Invite record into the Supabase table
    const { data: inserted, error } = await supabase
      .from('organization_invites')
      .insert(inviteDto)
      .select()
      .single();

    // Database insert failed
    if (error) {
      logger.error('Failed to insert Organization_Invite:', error);
      return { data: null, error: new Error(error.message) };
    }

    const invite = inserted as Invite;

    // Return only the fields required by the response shape
    return {
      data: {
        invite_id: invite.id,
        auth_id: invite.auth_id,
        phone_number: invite.phone_number,
      },
      error: null,
    };
  } catch (err) {
    // Unexpected service error - request did not reach the database
    logger.error('Unexpected error in createInviteService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};

/**
 * Accept or reject an Organization Invite.
 * Validates ownership, checks pending status, then performs the appropriate DB operations.
 * @param dto - Organization invite ID, action, auth_id and phone_number from middleware
 * @returns Service result with optional error code for business logic errors
 */
export const respondToInviteService = async (
  dto: RespondToInviteDto
): Promise<RespondToInviteServiceResult> => {
  try {
    const { organization_invite_id, action, auth_id, phone_number } = dto;

    // Step 1 — Fetch the invite by its ID
    const { data: invite, error: fetchError } = await supabase
      .from('organization_invites')
      .select('id, auth_id, phone_number, member_role_id, organization_id, is_pending')
      .eq('id', organization_invite_id)
      .single();

    // Invite not found in the database
    if (fetchError || !invite) {
      logger.error('Invite not found:', fetchError);
      return { data: null, error: new Error('No Invite found for the given organization_invite_id'), errorCode: 'NOT_FOUND' };
    }

    // Step 2 — Ownership validation: guard against null/empty before comparing
    const authIdMatch = !!(invite.auth_id && auth_id && invite.auth_id === auth_id);
    const phoneMatch = !!(invite.phone_number && phone_number && invite.phone_number === phone_number);
    const isOwner = authIdMatch || phoneMatch;

    if (!isOwner) {
      return { data: null, error: new Error('This Invitation does not belong to you'), errorCode: 'FORBIDDEN' };
    }

    // Step 3 — Check if invite is still pending
    if (!invite.is_pending) {
      return { data: null, error: new Error('Invite is no longer pending'), errorCode: 'CONFLICT' };
    }

    // Step 4 — Update invite as processed
    const { error: updateError } = await supabase
      .from('organization_invites')
      .update({ is_pending: false, updated_on: new Date().toISOString() })
      .eq('id', organization_invite_id);

    // Failed to update the invite record
    if (updateError) {
      logger.error('Failed to update Organization_Invite:', updateError);
      return { data: null, error: new Error(updateError.message) };
    }

    // Step 5 — Reject flow ends here; accept flow continues below
    if (action === 'reject') {
      return { data: { organization_invite_id, action }, error: null };
    }

    // Step 6 — Accept flow: insert into organization_members
    const { data: member, error: memberError } = await supabase
      .from('organization_members')
      .insert({ organization_id: invite.organization_id, auth_id })
      .select('id')
      .single();

    // Failed to insert organization member
    if (memberError || !member) {
      logger.error('Failed to insert Organization_Member:', memberError);
      return { data: null, error: new Error(memberError?.message ?? 'Failed to create organization member') };
    }

    // Step 7 — Accept flow: assign role via organization_member_role
    const { error: roleError } = await supabase
      .from('organization_member_role')
      .insert({ organization_member_id: member.id, member_role_id: invite.member_role_id });

    // Failed to insert member role
    if (roleError) {
      logger.error('Failed to insert Organization_Member_Role:', roleError);
      return { data: null, error: new Error(roleError.message) };
    }

    return { data: { organization_invite_id, action }, error: null };
  } catch (err) {
    // Unexpected service error
    logger.error('Unexpected error in respondToInviteService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
