// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { raiseIssueTicketSchema } from '@/validators/issue-tickets.validator';
import { issueTicketSchema } from '@/validators/issue-tickets.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { raiseIssueController } from '@/controllers';

// CONSTANTS //
import { ERROR_MESSAGES } from '@/constants/api';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

const raiseIssueTicketRoute = createRoute({
  method: 'post',
  path: '/issue_tickets/raise',
  tags: ['Issue Tickets'],
  summary: 'Raise a new issue ticket',
  request: {
    body: {
      content: {
        'application/json': {
          schema: raiseIssueTicketSchema,
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
          schema: apiResponseSchema(issueTicketSchema),
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

openapiApp.openapi(raiseIssueTicketRoute, (c) => raiseIssueController.raiseTicket(c));

