// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Invite, CreateInviteDto, CreateInviteResponse } from '@/models/invite.model';
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
