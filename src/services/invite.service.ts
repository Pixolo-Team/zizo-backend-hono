// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Invite, CreateInviteDto, CreateInviteResponse } from '@/models/invite.model';
import type { InviteResponse } from '@/validators/invite.validator';

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
    // Fetch pending Invites with Organization data
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
        organization:organizations ( name )
      `)
      .eq('phone_number', phoneNumber)
      .eq('is_pending', true);

    // Database error while fetching Invites
    if (invitesError) {
      logger.error('Failed to fetch Invites:', invitesError);
      return { data: null, error: new Error(invitesError.message) };
    }

    // No pending Invites found
    if (!invites || invites.length === 0) {
      return { data: [], error: null };
    }

    // Extract unique role IDs from Invite_fields JSONB
    const roleIds = [
      ...new Set(
        invites
          .map((i) => i.invite_fields?.membership_role_id)
          .filter(Boolean)
      ),
    ];

    // Fetch role names for the extracted role IDs
    let roles: { id: number; role_name: string }[] = [];
    if (roleIds.length > 0) {
      const { data: rolesData, error: rolesError } = await supabase
        .from('member_roles')
        .select('id, name')
        .in('id', roleIds);

      // Database error while fetching roles
      if (rolesError) {
        logger.error('Failed to fetch member roles:', rolesError);
        return { data: null, error: new Error(rolesError.message) };
      }

      // Default to empty array if no roles found, to safely use .find() during merge
      roles = rolesData ?? [];
    }

    // Merge role data into each Invite
    const enrichedInvites = invites.map((invite) => ({
      ...invite,
      member_role: roles.find(
        (r) => r.id === invite.invite_fields?.membership_role_id
      ) ?? null,
    }));

    return { data: enrichedInvites as unknown as InviteResponse[], error: null };
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
