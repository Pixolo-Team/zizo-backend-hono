// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Invite, CreateInviteDto, InviteResponse } from '@/models/invite.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Insert a new Invite into the database
 * @param inviteDto - Data transfer object containing invite insert data
 * @returns Inserted invite response or error
 */
export const createInviteService = async (
  inviteDto: CreateInviteDto
): Promise<QueryResponseData<InviteResponse>> => {
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
