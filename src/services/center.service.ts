// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { Center, CreateCenterDto, UpdateCenterDto } from '@/models/center.model';

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
  createCenterDto: CreateCenterDto
): Promise<QueryResponseData<Center>> => {
  try {
    const payload = {
      ...createCenterDto,
      is_active: createCenterDto.is_active ?? true,
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

/**
 * Update an existing Center in the database
 */
export const editCenterService = async (
  centerId: string,
  updateCenterDto: UpdateCenterDto
): Promise<QueryResponseData<Center>> => {
  try {
    const payload = {
      ...updateCenterDto,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(tables.CENTERS)
      .update(payload)
      .eq('id', centerId)
      .select('*')
      .maybeSingle();

    if (error) {
      logger.error('Failed to edit center:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error(ERROR_MESSAGES.NOT_FOUND) };
    }

    return { data: data as Center, error: null };
  } catch (err) {
    logger.error('Unexpected error in editCenterService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
