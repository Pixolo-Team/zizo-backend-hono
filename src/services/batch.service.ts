// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Batch, CreateBatchDto, EditBatchDto } from '@/models/batch.model';

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
 * Insert a new Batch into the database
 */
export const createBatchService = async (
  authId: string,
  createBatchDto: CreateBatchDto
): Promise<QueryResponseData<Batch>> => {
  try {
    const { data: orgMemberData, error: orgMemberError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('organization_id')
      .eq('auth_id', authId)
      .limit(1)
      .maybeSingle();

    if (orgMemberError) {
      logger.error('Failed to fetch organization member:', orgMemberError);
      return { data: null, error: new Error(orgMemberError.message) };
    }

    if (!orgMemberData?.organization_id) {
      return { data: null, error: new Error(ERROR_MESSAGES.FORBIDDEN) };
    }

    // Validate Center ownership
    const { data: centerData, error: centerError } = await getOwnedEntityRequest(
      tables.CENTERS,
      createBatchDto.center_id,
      orgMemberData.organization_id
    );

    if (centerError) {
      logger.error('Failed to validate center for batch:', centerError);
      return { data: null, error: new Error(centerError.message) };
    }

    if (!centerData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    // Validate Venue ownership
    const { data: venueData, error: venueError } = await getOwnedEntityRequest(
      tables.VENUES,
      createBatchDto.venue_id,
      orgMemberData.organization_id
    );

    if (venueError) {
      logger.error('Failed to validate venue for batch:', venueError);
      return { data: null, error: new Error(venueError.message) };
    }

    if (!venueData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    // Resolve coach users to organization members
    const coachUserIds = [createBatchDto.head_coach_user_id, createBatchDto.assistant_coach_user_id];
    const { data: coachesData, error: coachesError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('id, auth_id')
      .eq('organization_id', orgMemberData.organization_id)
      .in('auth_id', coachUserIds);

    if (coachesError) {
      logger.error('Failed to validate coaches for batch:', coachesError);
      return { data: null, error: new Error(coachesError.message) };
    }

    if (!coachesData || coachesData.length !== coachUserIds.length) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    const coachByUserId = new Map(coachesData.map((coach) => [coach.auth_id, coach.id]));
    const headCoachMemberId = coachByUserId.get(createBatchDto.head_coach_user_id);
    const assistantCoachMemberId = coachByUserId.get(createBatchDto.assistant_coach_user_id);

    if (!headCoachMemberId || !assistantCoachMemberId) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    // Validate selected players ownership if provided
    if (createBatchDto.player_ids && createBatchDto.player_ids.length > 0) {
      const { data: playersData, error: playersError } = await supabase
        .from(tables.ORG_PLAYER)
        .select('player_id')
        .eq('organization_id', orgMemberData.organization_id)
        .in('player_id', createBatchDto.player_ids);

      if (playersError) {
        logger.error('Failed to validate players for batch:', playersError);
        return { data: null, error: new Error(playersError.message) };
      }

      if (!playersData || playersData.length !== createBatchDto.player_ids.length) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    const payload = {
      organization_id: orgMemberData.organization_id,
      name: createBatchDto.name,
      description: createBatchDto.description ?? null,
      center_id: createBatchDto.center_id,
      venue_id: createBatchDto.venue_id,
    };

    const { data, error } = await supabase
      .from(tables.BATCHES)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      logger.error('Failed to create batch:', error);
      return { data: null, error: new Error(error.message) };
    }

    const createdBatch = data as Batch;
    const timestamp = new Date().toISOString();

    // Create default batch members (head coach + assistant coach)
    const { error: batchMembersError } = await supabase
      .from(tables.BATCH_MEMBER)
      .insert([
        {
          batch_id: createdBatch.id,
          organization_member_id: headCoachMemberId,
          role: 'head_coach',
          start_date: timestamp,
          end_date: null,
        },
        {
          batch_id: createdBatch.id,
          organization_member_id: assistantCoachMemberId,
          role: 'assistant_coach',
          start_date: timestamp,
          end_date: null,
        },
      ]);

    if (batchMembersError) {
      logger.error('Failed to create default batch members:', batchMembersError);
      return { data: null, error: new Error(batchMembersError.message) };
    }

    // Create batch-player links if players are selected
    if (createBatchDto.player_ids && createBatchDto.player_ids.length > 0) {
      const playerRows = createBatchDto.player_ids.map((playerId) => ({
        batch_id: createdBatch.id,
        player_id: playerId,
        start_date: timestamp,
        end_date: null,
      }));

      const { error: batchPlayersError } = await supabase
        .from(tables.BATCH_PLAYER)
        .insert(playerRows);

      if (batchPlayersError) {
        logger.error('Failed to create batch players:', batchPlayersError);
        return { data: null, error: new Error(batchPlayersError.message) };
      }
    }

    return { data: createdBatch, error: null };
  } catch (err) {
    logger.error('Unexpected error in createBatchService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};

/**
 * Update an existing Batch in the database
 */
export const editBatchService = async (
  authId: string,
  batchId: string,
  editBatchDto: EditBatchDto
): Promise<QueryResponseData<Batch>> => {
  try {
    const { data: orgMemberData, error: orgMemberError } = await supabase
      .from(tables.ORG_MEMBERS)
      .select('organization_id')
      .eq('auth_id', authId)
      .limit(1)
      .maybeSingle();

    if (orgMemberError) {
      logger.error('Failed to fetch organization member:', orgMemberError);
      return { data: null, error: new Error(orgMemberError.message) };
    }

    if (!orgMemberData?.organization_id) {
      return { data: null, error: new Error(ERROR_MESSAGES.FORBIDDEN) };
    }

    const { data: existingBatchData, error: existingBatchError } = await supabase
      .from(tables.BATCHES)
      .select('id')
      .eq('id', batchId)
      .eq('organization_id', orgMemberData.organization_id)
      .limit(1)
      .maybeSingle();

    if (existingBatchError) {
      logger.error('Failed to validate batch for update:', existingBatchError);
      return { data: null, error: new Error(existingBatchError.message) };
    }

    if (!existingBatchData) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    if (editBatchDto.center_id) {
      const { data: centerData, error: centerError } = await getOwnedEntityRequest(
        tables.CENTERS,
        editBatchDto.center_id,
        orgMemberData.organization_id
      );

      if (centerError) {
        logger.error('Failed to validate center for batch update:', centerError);
        return { data: null, error: new Error(centerError.message) };
      }

      if (!centerData) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    if (editBatchDto.venue_id) {
      const { data: venueData, error: venueError } = await getOwnedEntityRequest(
        tables.VENUES,
        editBatchDto.venue_id,
        orgMemberData.organization_id
      );

      if (venueError) {
        logger.error('Failed to validate venue for batch update:', venueError);
        return { data: null, error: new Error(venueError.message) };
      }

      if (!venueData) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    let headCoachMemberId: string | null = null;
    let assistantCoachMemberId: string | null = null;

    if (editBatchDto.head_coach_user_id && editBatchDto.assistant_coach_user_id) {
      const coachUserIds = [editBatchDto.head_coach_user_id, editBatchDto.assistant_coach_user_id];
      const { data: coachesData, error: coachesError } = await supabase
        .from(tables.ORG_MEMBERS)
        .select('id, auth_id')
        .eq('organization_id', orgMemberData.organization_id)
        .in('auth_id', coachUserIds);

      if (coachesError) {
        logger.error('Failed to validate coaches for batch update:', coachesError);
        return { data: null, error: new Error(coachesError.message) };
      }

      if (!coachesData || coachesData.length !== coachUserIds.length) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }

      const coachByUserId = new Map(coachesData.map((coach) => [coach.auth_id, coach.id]));
      headCoachMemberId = coachByUserId.get(editBatchDto.head_coach_user_id) ?? null;
      assistantCoachMemberId = coachByUserId.get(editBatchDto.assistant_coach_user_id) ?? null;

      if (!headCoachMemberId || !assistantCoachMemberId) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }
    }

    if (editBatchDto.player_ids) {
      if (editBatchDto.player_ids.length > 0) {
        const { data: playersData, error: playersError } = await supabase
          .from(tables.ORG_PLAYER)
          .select('player_id')
          .eq('organization_id', orgMemberData.organization_id)
          .in('player_id', editBatchDto.player_ids);

        if (playersError) {
          logger.error('Failed to validate players for batch update:', playersError);
          return { data: null, error: new Error(playersError.message) };
        }

        if (!playersData || playersData.length !== editBatchDto.player_ids.length) {
          return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
        }
      }
    }

    const updatePayload: {
      name?: string;
      description?: string | null;
      center_id?: string;
      venue_id?: string;
    } = {};

    if (editBatchDto.name !== undefined) {
      updatePayload.name = editBatchDto.name;
    }

    if (editBatchDto.description !== undefined) {
      updatePayload.description = editBatchDto.description ?? null;
    }

    if (editBatchDto.center_id !== undefined) {
      updatePayload.center_id = editBatchDto.center_id;
    }

    if (editBatchDto.venue_id !== undefined) {
      updatePayload.venue_id = editBatchDto.venue_id;
    }

    let updatedBatch: Batch | null = null;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from(tables.BATCHES)
        .update(updatePayload)
        .eq('id', batchId)
        .eq('organization_id', orgMemberData.organization_id)
        .select('*')
        .single();

      if (error) {
        logger.error('Failed to update batch:', error);
        return { data: null, error: new Error(error.message) };
      }

      updatedBatch = data as Batch;
    } else {
      const { data, error } = await supabase
        .from(tables.BATCHES)
        .select('*')
        .eq('id', batchId)
        .eq('organization_id', orgMemberData.organization_id)
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Failed to fetch batch after update:', error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
      }

      updatedBatch = data as Batch;
    }

    const timestamp = new Date().toISOString();

    if (headCoachMemberId && assistantCoachMemberId) {
      const { error: deleteBatchMembersError } = await supabase
        .from(tables.BATCH_MEMBER)
        .delete()
        .eq('batch_id', batchId)
        .in('role', ['head_coach', 'assistant_coach']);

      if (deleteBatchMembersError) {
        logger.error('Failed to clear default batch members on update:', deleteBatchMembersError);
        return { data: null, error: new Error(deleteBatchMembersError.message) };
      }

      const { error: insertBatchMembersError } = await supabase
        .from(tables.BATCH_MEMBER)
        .insert([
          {
            batch_id: batchId,
            organization_member_id: headCoachMemberId,
            role: 'head_coach',
            start_date: timestamp,
            end_date: null,
          },
          {
            batch_id: batchId,
            organization_member_id: assistantCoachMemberId,
            role: 'assistant_coach',
            start_date: timestamp,
            end_date: null,
          },
        ]);

      if (insertBatchMembersError) {
        logger.error('Failed to update default batch members:', insertBatchMembersError);
        return { data: null, error: new Error(insertBatchMembersError.message) };
      }
    }

    if (editBatchDto.player_ids !== undefined) {
      const { error: deleteBatchPlayersError } = await supabase
        .from(tables.BATCH_PLAYER)
        .delete()
        .eq('batch_id', batchId);

      if (deleteBatchPlayersError) {
        logger.error('Failed to clear batch players on update:', deleteBatchPlayersError);
        return { data: null, error: new Error(deleteBatchPlayersError.message) };
      }

      if (editBatchDto.player_ids.length > 0) {
        const playerRows = editBatchDto.player_ids.map((playerId) => ({
          batch_id: batchId,
          player_id: playerId,
          start_date: timestamp,
          end_date: null,
        }));

        const { error: insertBatchPlayersError } = await supabase
          .from(tables.BATCH_PLAYER)
          .insert(playerRows);

        if (insertBatchPlayersError) {
          logger.error('Failed to update batch players:', insertBatchPlayersError);
          return { data: null, error: new Error(insertBatchPlayersError.message) };
        }
      }
    }

    return { data: updatedBatch, error: null };
  } catch (err) {
    logger.error('Unexpected error in editBatchService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
