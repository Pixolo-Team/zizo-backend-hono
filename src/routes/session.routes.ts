// CONTRACTS //
import { createSessionRoute, editSessionRoute, getSessionsRoute } from '@/contracts/session.contract';

// CONTROLLERS //
import { sessionController } from '@/controllers/session.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// GET /sessions
openapiApp.openapi(getSessionsRoute, (c) => sessionController.getSessions(c));

// POST /session/create
openapiApp.openapi(createSessionRoute, (c) => sessionController.createSession(c));

// PATCH /session/edit/{id}
openapiApp.openapi(editSessionRoute, (c) => sessionController.editSession(c));
