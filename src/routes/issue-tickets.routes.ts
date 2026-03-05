// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { raiseIssueTicketSchema } from '@/validators/issue-tickets.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// SERVICES //
import { raiseIssueTicketService } from '@/services/issue-tickets.service';

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
          schema: apiResponseSchema(raiseIssueTicketSchema),
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

openapiApp.openapi(raiseIssueTicketRoute, async (c) => {
  // Parse and validate the request body
  const body = await c.req.json();
  const parsed = raiseIssueTicketSchema.safeParse(body);

  if (!parsed.success) {
    // Return 422 for validation errors
    return c.json(
      {
        status: false,
        status_code: 422,
        message: 'Validation Error',
        data: null,
        error: parsed.error.message,
      },
      422
    );
  }

  // Call the service layer with validated data
  const { data, error } = await raiseIssueTicketService(parsed.data);

  if (error) {
    return c.json(
      {
        status: false,
        status_code: 500,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
        error: error.message,
      },
      500
    );
  }

  return c.json(
    {
      status: true,
      status_code: 201,
      message: 'Issue Raised Successfully',
      data,
      error: null,
    },
    201
  );
});

