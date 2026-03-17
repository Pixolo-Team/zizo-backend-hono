// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import {
  InviteResponseSchema,
  createInviteRequestSchema,
  InviteSchema,
} from '@/validators/invite.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { inviteController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// MIDDLEWARES //
import { authMiddleware } from '@/middlewares/auth.middleware';

// Route definition for fetching pending Organization Invites for a User
const GetUserInvitesRoute = createRoute({
  method: 'post',
  path: '/invites/get-user-invites',
  tags: ['Organization Invites'],
  summary: 'Fetch all pending Organization Invites for a User',
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      description: 'Pending Organization Invites fetched successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.array(InviteResponseSchema)),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    404: {
      description: 'No pending Organization Invites found for this User',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
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

// POST: /invites/get-user-invites
openapiApp.openapi(GetUserInvitesRoute, (c) => inviteController.getUserPendingInvites(c));

// Route definition for creating a new Organization_Invite
const createInviteRoute = createRoute({
  method: 'post',
  path: '/invites/create',
  tags: ['Organization Invites'],
  summary: 'Create a new Invite for a User to join an Organization',
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createInviteRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Invite created successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(InviteSchema),
        },
      },
    },
    400: {
      description: 'Bad Request - Malformed JSON',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
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

// POST: /invites/create
openapiApp.openapi(createInviteRoute, (c) => inviteController.createInvite(c));
