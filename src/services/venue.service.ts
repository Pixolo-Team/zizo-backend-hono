// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { CreateVenueDto, Venue } from '@/models/venue.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

// CONSTANTS //
import { tables } from '@/constants/database.constants';
import { ERROR_MESSAGES } from '@/constants/api';

/**
 * Insert a new Venue into the database
 */
export const createVenueService = async (
  authId: string,
  createVenueDto: CreateVenueDto
): Promise<QueryResponseData<Venue>> => {
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

    const payload = {
      name: createVenueDto.name,
      address: createVenueDto.address,
      city: createVenueDto.city,
      google_link: createVenueDto.google_link ?? null,
      oraganization_id: orgMemberData.organization_id,
      is_active: true,
    };

    const { data, error } = await supabase
      .from(tables.VENUES)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      logger.error('Failed to create venue:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Venue, error: null };
  } catch (err) {
    logger.error('Unexpected error in createVenueService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};

/**
 * Fetch all Venues for authenticated user's organization
 */
export const getAllVenuesService = async (
  authId: string
): Promise<QueryResponseData<Venue[]>> => {
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

    const { data, error } = await supabase
      .from(tables.VENUES)
      .select('*')
      .eq('oraganization_id', orgMemberData.organization_id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch venues:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data as Venue[]) ?? [], error: null };
  } catch (err) {
    logger.error('Unexpected error in getAllVenuesService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
