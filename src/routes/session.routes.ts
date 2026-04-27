// CONTRACTS //
import { createSessionRoute } from '@/contracts/session.contract';

// CONTROLLERS //
import { sessionController } from '@/controllers/session.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /session/create
openapiApp.openapi(createSessionRoute, (c) => sessionController.createSession(c));
