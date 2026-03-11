// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { InviteResponseSchema } from '@/validators/invite.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { inviteController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Route definition for fetching pending Invites for a User
const GetUserInvitesRoute = createRoute({
  method: 'post',
  path: '/invites/get-user-invites',
  tags: ['Invites'],
  summary: 'Fetch all pending invites for a user',
  responses: {
    200: {
      description: 'Pending invites fetched successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.array(InviteResponseSchema)),
        },
      },
    },
    404: {
      description: 'No pending invites found for this user',
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
