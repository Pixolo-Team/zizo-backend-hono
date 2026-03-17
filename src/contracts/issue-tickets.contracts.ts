import { ApiRoutes } from "@/constants/routes.constants";
import { raiseIssueTicketRequestSchema, IssueTicketSchema } from "@/validators";
import { apiResponseSchema } from "@/validators/api-response.schema";
import { createRoute } from "@hono/zod-openapi";
import z from "zod";

// Route definition for raising a new Issue Ticket
export const RaiseIssueTicketRoute = createRoute({
  method: 'post',
  path: ApiRoutes.RAISE_ISSUE,
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