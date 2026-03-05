// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { raiseIssueTicketSchema } from '@/validators/issue-tickets.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLERS //
import { raiseIssueTicketController } from '@/controllers/issue-tickets.controller';

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
          schema: apiResponseSchema(
            z.object({
              id: z.string(),
              name: z.string(),
              phone_number: z.string(),
              description: z.string(),
              created_at: z.string(),
            })
          ),
        },
      },
    },
    422: {
      description: 'Validation Error',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

openapiApp.openapi(raiseIssueTicketRoute, (c) => raiseIssueTicketController(c));
