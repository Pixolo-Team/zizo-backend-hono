// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { raiseIssueTicketRequestSchema, IssueTicketSchema } from '@/validators/issue-tickets.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { issueTicketsController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Route definition for raising a new Issue Ticket
const RaiseIssueTicketRoute = createRoute({
  method: 'post',
  path: '/issue_tickets/raise',
  tags: ['Issue Tickets'],
  summary: 'Raise a new Issue Ticket',
  request: {
    body: {
      content: {
        'application/json': {
          schema: raiseIssueTicketRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Issue Raised Successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(IssueTicketSchema),
        },
      },
    },
    422: {
      description: 'Validation Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
  },
});

// POST: /issue_tickets/raise
openapiApp.openapi(RaiseIssueTicketRoute, (c) => issueTicketsController.raiseTicket(c));


