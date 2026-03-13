// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { InviteFields, CreateInviteDto, InviteResponse, CreateInviteResponse } from '@/models/invite.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Fetch all pending Invites for a User by phone_number.
 */
export const getUserInvitesService = async (
  phoneNumber: string
): Promise<QueryResponseData<InviteResponse[]>> => {
  try {

    // Fetch pending Invites with organization and role data in a single query
    const { data: invites, error: invitesError } = await supabase
      .from('invites')
      .select(`
        id,
        phone_number,
        invite_fields,
        is_pending,
        invited_by,
        organization_id,
        created_on,
        organizations ( name ),
        membership_roles ( role_name )
      `)
      .eq('phone_number', phoneNumber)
      .eq('is_pending', true);

    // Database error while fetching Invites
    if (invitesError) {
      logger.error('Failed to fetch invites:', invitesError);
      return { data: null, error: new Error(invitesError.message) };
    }

    // No pending Invites found
    if (!invites || invites.length === 0) {
      return { data: [], error: null };
    }

    // Map each Invite to the response shape
    const enrichedInvites: InviteResponse[] = invites.map((invite) => {
      const inviteFields = invite.invite_fields as InviteFields | null;
      const organizationId = inviteFields?.organization_id ?? invite.organization_id;
      const roleId = inviteFields?.membership_role_id ?? '';

      // Extract joined organization and role names
      const orgName = (invite.organizations as { name: string } | null)?.name ?? '';
      const roleName = (invite.membership_roles as { role_name: string } | null)?.role_name ?? '';

      return {
        invite_id: invite.id,
        phone_number: invite.phone_number,
        organization_id: organizationId,
        organization_name: orgName,
        role_id: roleId,
        role_name: roleName,
        invite_fields: inviteFields ?? {},
        is_pending: invite.is_pending,
        invited_by: invite.invited_by ?? '',
        created_on: invite.created_on,
      };
    });

    return { data: enrichedInvites, error: null };
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
      .from('invites')
      .insert(inviteDto)
      .select()
      .single();

    // Database insert failed
    if (error) {
      logger.error('Failed to insert Invite:', error);
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
