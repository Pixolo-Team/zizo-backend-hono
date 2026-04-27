// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { CreateSessionDto, EditSessionDto, Session } from '@/models/session.model';

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

/**
 * Update an existing Session in the database
 */
export const editSessionService = async (
  authId: string,
  sessionId: string,
  editSessionDto: EditSessionDto
): Promise<QueryResponseData<Session>> => {
  try {
    const { data: orgMemberData, error: orgMemberError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('organization_id')
      .eq('auth_id', authId)
      .limit(1)
      .maybeSingle();

    if (orgMemberError) {
      logger.error('Failed to fetch organization member for session edit:', orgMemberError);
      return { data: null, error: new Error(orgMemberError.message) };
    }

    if (!orgMemberData?.organization_id) {
      return { data: null, error: new Error(ERROR_MESSAGES.FORBIDDEN) };
    }

    const { data: existingSessionData, error: existingSessionError } = await supabase
      .from(tables.SESSIONS)
      .select('id, batch_id')
      .eq('id', sessionId)
      .eq('organization_id', orgMemberData.organization_id)
      .limit(1)
      .maybeSingle();

    if (existingSessionError) {
      logger.error('Failed to validate session for update:', existingSessionError);
      return { data: null, error: new Error(existingSessionError.message) };
    }

    if (!existingSessionData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    if (editSessionDto.batch_id) {
      const { data: batchData, error: batchError } = await getOwnedEntityRequest(
        tables.BATCHES,
        editSessionDto.batch_id,
        orgMemberData.organization_id
      );

      if (batchError) {
        logger.error('Failed to validate batch for session edit:', batchError);
        return { data: null, error: new Error(batchError.message) };
      }

      if (!batchData) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    if (editSessionDto.venue_id) {
      const { data: venueData, error: venueError } = await getOwnedEntityRequest(
        tables.VENUES,
        editSessionDto.venue_id,
        orgMemberData.organization_id
      );

      if (venueError) {
        logger.error('Failed to validate venue for session edit:', venueError);
        return { data: null, error: new Error(venueError.message) };
      }

      if (!venueData) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    if (editSessionDto.session_members) {
      const sessionMemberIds = editSessionDto.session_members.map(
        (item) => item.organization_member_id
      );

      const { data: membersData, error: membersError } = await supabase
        .from(tables.ORG_MEMBERS)
        .select('id')
        .eq('organization_id', orgMemberData.organization_id)
        .in('id', sessionMemberIds);

      if (membersError) {
        logger.error('Failed to validate session members for session edit:', membersError);
        return { data: null, error: new Error(membersError.message) };
      }

      if (!membersData || membersData.length !== sessionMemberIds.length) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    const updatePayload: {
      name?: string;
      date?: string;
      start_time?: string;
      end_time?: string;
      reporting_time?: string | null;
      batch_id?: string;
      venue_id?: string;
      session_type?: string;
      status?: string;
    } = {};

    if (editSessionDto.name !== undefined) {
      updatePayload.name = editSessionDto.name;
    }

    if (editSessionDto.date !== undefined) {
      updatePayload.date = editSessionDto.date;
    }

    if (editSessionDto.start_time !== undefined) {
      updatePayload.start_time = editSessionDto.start_time;
    }

    if (editSessionDto.end_time !== undefined) {
      updatePayload.end_time = editSessionDto.end_time;
    }

    if (editSessionDto.reporting_time !== undefined) {
      updatePayload.reporting_time = editSessionDto.reporting_time ?? null;
    }

    if (editSessionDto.batch_id !== undefined) {
      updatePayload.batch_id = editSessionDto.batch_id;
    }

    if (editSessionDto.venue_id !== undefined) {
      updatePayload.venue_id = editSessionDto.venue_id;
    }

    if (editSessionDto.session_type !== undefined) {
      updatePayload.session_type = editSessionDto.session_type;
    }

    if (editSessionDto.status !== undefined) {
      updatePayload.status = editSessionDto.status;
    }

    let updatedSession: Session | null = null;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from(tables.SESSIONS)
        .update(updatePayload)
        .eq('id', sessionId)
        .eq('organization_id', orgMemberData.organization_id)
        .select('*')
        .single();

      if (error) {
        logger.error('Failed to update session:', error);
        return { data: null, error: new Error(error.message) };
      }

      updatedSession = data as Session;
    } else {
      const { data, error } = await supabase
        .from(tables.SESSIONS)
        .select('*')
        .eq('id', sessionId)
        .eq('organization_id', orgMemberData.organization_id)
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Failed to fetch session after update:', error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }

      updatedSession = data as Session;
    }

    if (editSessionDto.session_members) {
      const { error: deleteSessionMembersError } = await supabase
        .from(tables.SESSION_MEMBER)
        .delete()
        .eq('session_id', sessionId);

      if (deleteSessionMembersError) {
        logger.error('Failed to clear session members on update:', deleteSessionMembersError);
        return { data: null, error: new Error(deleteSessionMembersError.message) };
      }

      const sessionMemberRows = editSessionDto.session_members.map((item) => ({
        session_id: sessionId,
        organization_member_id: item.organization_member_id,
        session_role: item.session_role,
      }));

      const { error: insertSessionMembersError } = await supabase
        .from(tables.SESSION_MEMBER)
        .insert(sessionMemberRows);

      if (insertSessionMembersError) {
        logger.error('Failed to update session members:', insertSessionMembersError);
        return { data: null, error: new Error(insertSessionMembersError.message) };
      }
    }

    const effectiveBatchId = editSessionDto.batch_id ?? existingSessionData.batch_id;

    if (editSessionDto.batch_id !== undefined) {
      const { error: deleteSessionPlayersError } = await supabase
        .from(tables.SESSION_PLAYER)
        .delete()
        .eq('session_id', sessionId);

      if (deleteSessionPlayersError) {
        logger.error('Failed to clear session players on update:', deleteSessionPlayersError);
        return { data: null, error: new Error(deleteSessionPlayersError.message) };
      }

      const { data: batchPlayersData, error: batchPlayersError } = await supabase
        .from(tables.BATCH_PLAYER)
        .select('player_id')
        .eq('batch_id', effectiveBatchId);

      if (batchPlayersError) {
        logger.error('Failed to fetch batch players for session edit:', batchPlayersError);
        return { data: null, error: new Error(batchPlayersError.message) };
      }

      if (batchPlayersData && batchPlayersData.length > 0) {
        const sessionPlayerRows = batchPlayersData.map((player) => ({
          session_id: sessionId,
          player_id: player.player_id,
        }));

        const { error: insertSessionPlayersError } = await supabase
          .from(tables.SESSION_PLAYER)
          .insert(sessionPlayerRows);

        if (insertSessionPlayersError) {
          logger.error('Failed to update session players:', insertSessionPlayersError);
          return { data: null, error: new Error(insertSessionPlayersError.message) };
        }
      }
    }

    return { data: updatedSession, error: null };
  } catch (err) {
    logger.error('Unexpected error in editSessionService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
