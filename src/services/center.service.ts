// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Center, CreateCenterDto } from '@/models/center.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

// CONSTANTS //
import { tables } from '@/constants/database.constants';
import { ERROR_MESSAGES } from '@/constants/api';

/**
 * Insert a new Center into the database
 */
export const createCenterService = async (
  authId: string,
  createCenterDto: CreateCenterDto
): Promise<QueryResponseData<Center>> => {
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

    const payload: CreateCenterDto = {
      name: createCenterDto.name,
      location: createCenterDto.location,
      city: createCenterDto.city,
      state: createCenterDto.state,
      country: createCenterDto.country,
      organization_id: orgMemberData.organization_id,
      is_active: true,
    };

    const { data, error } = await supabase
      .from(tables.CENTERS)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      logger.error('Failed to create center:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Center, error: null };
  } catch (err) {
    logger.error('Unexpected error in createCenterService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
