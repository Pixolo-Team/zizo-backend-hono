// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { IssueTicket, CreateIssueTicketDto } from '@/models/issue-tickets.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Insert a new issue ticket into the database
 * @param data - Validated issue ticket data
 * @returns QueryResponseData containing the created issue ticket or an error
 */
export const raiseIssueTicketService = async (
  data: CreateIssueTicketDto
): Promise<QueryResponseData<IssueTicket>> => {
  try {
    // Insert the issue ticket into the Supabase table
    const { data: inserted, error } = await supabase
      .from('issue_tickets')
      .insert(data)
      .select()
      .single();

    if (error) {
      logger.error('Failed to insert issue ticket:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: inserted as IssueTicket, error: null };
  } catch (err) {
    logger.error('Unexpected error in raiseIssueTicketService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
