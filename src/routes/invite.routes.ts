// CONTROLLER //
import { inviteController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// MIDDLEWARES //
import { GetUserInvitesRoute, createInviteRoute } from '@/contracts/invite.contracts';

// POST: /invites/get-user-invites
openapiApp.openapi(GetUserInvitesRoute, (c) => inviteController.getUserPendingInvites(c));

// POST: /invites/create
openapiApp.openapi(createInviteRoute, (c) => inviteController.createInvite(c));
