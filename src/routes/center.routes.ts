// CONTRACTS //
import { createCenterRoute } from '@/contracts/center.contract';

// CONTROLLERS //
import { centerController } from '@/controllers/center.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /centers/create
openapiApp.openapi(createCenterRoute, (c) => centerController.createCenter(c));
