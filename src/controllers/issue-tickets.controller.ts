// TYPES //
import type { Context } from 'hono';

// UTILS //
import { successResponse, errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// VALIDATORS //
import { raiseIssueTicketRequestSchema } from '@/validators/issue-tickets.validator';

// SERVICES //
import { raiseIssueTicketService } from '@/services/issue-tickets.service';

/** Handles HTTP requests for Issue Ticket and returns appropriate responses */
export class RaiseIssueController {

  /** Validates and processes an incoming Issue Ticket request */
  async raiseTicket(c: Context) {
    try {
      // Parse and validate the request body
      const body = await c.req.json();
      const parsed = raiseIssueTicketRequestSchema.safeParse(body);

      if (!parsed.success) {
        // Return 422 for validation errors
        return errorResponse(
          c,
          parsed.error.message,
          'Validation Error',
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      // Call the service layer with validated data
      const { data, error } = await raiseIssueTicketService(parsed.data);

      // Database insert failed
      if (error) {
        return errorResponse(
          c,
          error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, data, 'Issue Raised Successfully', HTTP_STATUS.CREATED);
    } 
      // Any other Errors
      catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
};

export const raiseIssueController = new RaiseIssueController();
