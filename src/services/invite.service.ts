// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Invite, CreateInviteDto, InviteResponse, CreateInviteResponse } from '@/models/invite.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Fetch all pending invites for a user by phone_number.
 * Also enriches each invite with organization name and role name.
 * @param phoneNumber - Phone number of the authenticated user
 * @returns QueryResponseData containing an array of enriched invite responses
 */
export const getUserInvitesService = async (
  phoneNumber: string
): Promise<QueryResponseData<InviteResponse[]>> => {
  try {
    // Fetch pending invites for the user by phone_number
    const { data: invites, error: invitesError } = await supabase
      .from('invites')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('is_pending', true);

    // Database error while fetching invites
    if (invitesError) {
      logger.error('Failed to fetch invites:', invitesError);
      return { data: null, error: new Error(invitesError.message) };
    }

    // No pending invites found
    if (!invites || invites.length === 0) {
      return { data: [], error: null };
    }

    // Enrich each invite with organization and role information
    const enrichedInvites: InviteResponse[] = await Promise.all(
      (invites as Invite[]).map(async (invite) => {
        const organizationId = invite.invite_fields?.organization_id ?? invite.organization_id;
        const roleId = invite.invite_fields?.membership_role_id ?? '';

        // Fetch organization name
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', organizationId)
          .single();

        // Fetch role name
        const { data: roleData } = await supabase
          .from('membership_roles')
          .select('role_name')
          .eq('id', roleId)
          .single();

        return {
          invite_id: invite.id,
          phone_number: invite.phone_number,
          organization_id: organizationId,
          organization_name: orgData?.name ?? '',
          role_id: roleId,
          role_name: roleData?.role_name ?? '',
          invite_fields: invite.invite_fields,
          is_pending: invite.is_pending,
          invited_by: invite.invited_by,
          created_on: invite.created_on,
        };
      })
    );

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
    // Insert the invite record into the Supabase table
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
