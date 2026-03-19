// CONTRACTS //
import { getUserInvitesRoute, createInviteRoute, respondToInviteRoute } from '@/contracts/invite.contract';

// CONTROLLER //
import { inviteController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST: /invites/get-user-invites
openapiApp.openapi(getUserInvitesRoute, (c) => inviteController.getUserPendingInvites(c));

// POST: /invites/create
openapiApp.openapi(createInviteRoute, (c) => inviteController.createInvite(c));

// POST: /organization-invites/respond
openapiApp.openapi(respondToInviteRoute, (c) => inviteController.respondToInvite(c));
