// TYPES //
import type { QueryResponseData } from '@/common/types/query.response.type';
import type { IssueTicket, CreateIssueTicketDto } from '@/models/issue-tickets.model';

// CONFIG //
import { supabase } from '@/config/supabase';

// UTILS //
import { logger } from '@/common/utils/logger.util';

/**
 * Insert a new Issue Ticket into the database
 */
export const raiseIssueTicketService = async (
  IssueTicketItem: CreateIssueTicketDto
): Promise<QueryResponseData<IssueTicket>> => {
  try {

    // Insert the Issue Ticket into the Supabase table
    const { data: inserted, error } = await supabase
      .from('issue_tickets')
      .insert(IssueTicketItem)
      .select()
      .single();

    // Database Fail/Error
    if (error) {
      logger.error('Failed to insert Issue Ticket:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: inserted as IssueTicket, error: null };
  } catch (err) {

    // Unexpected service error - request did not reach the database
    logger.error('Unexpected error in raiseIssueTicketService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
    };
  }
};
