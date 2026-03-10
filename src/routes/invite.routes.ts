// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import { createInviteRequestSchema, InviteSchema } from '@/validators/invite.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { inviteController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Route definition for creating a new Invite
const CreateInviteRoute = createRoute({
  method: 'post',
  path: '/invites/create',
  tags: ['Invites'],
  summary: 'Create a new Invite for a user to join an organization',
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
openapiApp.openapi(CreateInviteRoute, (c) => inviteController.createInvite(c));
