// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { CreateSessionDto, Session } from '@/models/session.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

// CONSTANTS //
import { tables } from '@/constants/database.constants';
import { ERROR_MESSAGES } from '@/constants/api';

/**
 * Resolves entity ownership with backward compatibility for org column naming.
 * Some tables used `oraganization_id` historically and were later standardized.
 */
const getOwnedEntityRequest = async (
  tableName: string,
  entityId: string,
  organizationId: string
): Promise<QueryResponseData<{ id: string }>> => {
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .eq('id', entityId)
    .eq('organization_id', organizationId)
    .limit(1)
    .maybeSingle();

  if (!error) {
    return { data, error: null };
  }

  const { data: legacyData, error: legacyError } = await supabase
    .from(tableName)
    .select('id')
    .eq('id', entityId)
    .eq('oraganization_id', organizationId)
    .limit(1)
    .maybeSingle();

  if (legacyError) {
    return { data: null, error: new Error(legacyError.message) };
  }

  return { data: legacyData, error: null };
};

/**
 * Insert a new Session into the database and auto-map players from batch_player.
 */
export const createSessionService = async (
  authId: string,
  createSessionDto: CreateSessionDto
): Promise<QueryResponseData<Session>> => {
  try {
    const { data: orgMemberData, error: orgMemberError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('organization_id')
      .eq('auth_id', authId)
      .limit(1)
      .maybeSingle();

    if (orgMemberError) {
      logger.error('Failed to fetch organization member for session create:', orgMemberError);
      return { data: null, error: new Error(orgMemberError.message) };
    }

    if (!orgMemberData?.organization_id) {
      return { data: null, error: new Error(ERROR_MESSAGES.FORBIDDEN) };
    }

    const { data: batchData, error: batchError } = await getOwnedEntityRequest(
      tables.BATCHES,
      createSessionDto.batch_id,
      orgMemberData.organization_id
    );

    if (batchError) {
      logger.error('Failed to validate batch for session create:', batchError);
      return { data: null, error: new Error(batchError.message) };
    }

    if (!batchData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    const { data: venueData, error: venueError } = await getOwnedEntityRequest(
      tables.VENUES,
      createSessionDto.venue_id,
      orgMemberData.organization_id
    );

    if (venueError) {
      logger.error('Failed to validate venue for session create:', venueError);
      return { data: null, error: new Error(venueError.message) };
    }

    if (!venueData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    const sessionMemberIds = createSessionDto.session_members.map(
      (item) => item.organization_member_id
    );

    const { data: membersData, error: membersError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('id')
      .eq('organization_id', orgMemberData.organization_id)
      .in('id', sessionMemberIds);

    if (membersError) {
      logger.error('Failed to validate session members for session create:', membersError);
      return { data: null, error: new Error(membersError.message) };
    }

    if (!membersData || membersData.length !== sessionMemberIds.length) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    const sessionPayload = {
      date: createSessionDto.date,
      start_time: createSessionDto.start_time,
      end_time: createSessionDto.end_time,
      batch_id: createSessionDto.batch_id,
      venue_id: createSessionDto.venue_id,
      status: createSessionDto.status ?? 'scheduled',
      session_type: createSessionDto.session_type ?? 'training',
      reporting_time: createSessionDto.reporting_time ?? null,
      name: createSessionDto.name,
      organization_id: orgMemberData.organization_id,
      session_template_id: null,
    };

    const { data: insertedSession, error: sessionInsertError } = await supabase
      .from(tables.SESSIONS)
      .insert(sessionPayload)
      .select('*')
      .single();

    if (sessionInsertError) {
      logger.error('Failed to create session:', sessionInsertError);
      return { data: null, error: new Error(sessionInsertError.message) };
    }

    const createdSession = insertedSession as Session;

    const sessionMemberRows = createSessionDto.session_members.map((item) => ({
      session_id: createdSession.id,
      organization_member_id: item.organization_member_id,
      session_role: item.session_role,
    }));

    const { error: sessionMembersError } = await supabase
      .from(tables.SESSION_MEMBER)
      .insert(sessionMemberRows);

    if (sessionMembersError) {
      logger.error('Failed to create session members:', sessionMembersError);
      return { data: null, error: new Error(sessionMembersError.message) };
    }

    const { data: batchPlayersData, error: batchPlayersError } = await supabase
      .from(tables.BATCH_PLAYER)
      .select('player_id')
      .eq('batch_id', createSessionDto.batch_id);

    if (batchPlayersError) {
      logger.error('Failed to fetch batch players for session create:', batchPlayersError);
      return { data: null, error: new Error(batchPlayersError.message) };
    }

    if (batchPlayersData && batchPlayersData.length > 0) {
      const sessionPlayerRows = batchPlayersData.map((player) => ({
        session_id: createdSession.id,
        player_id: player.player_id,
      }));

      const { error: sessionPlayersError } = await supabase
        .from(tables.SESSION_PLAYER)
        .insert(sessionPlayerRows);

      if (sessionPlayersError) {
        logger.error('Failed to create session players:', sessionPlayersError);
        return { data: null, error: new Error(sessionPlayersError.message) };
      }
    }

    return { data: createdSession, error: null };
  } catch (err) {
    logger.error('Unexpected error in createSessionService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
