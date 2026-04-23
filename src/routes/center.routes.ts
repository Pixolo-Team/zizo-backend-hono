// CONTRACTS //
import { createCenterRoute, getAllCentersRoute } from '@/contracts/center.contract';

// CONTROLLERS //
import { centerController } from '@/controllers/center.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /centers/create
openapiApp.openapi(createCenterRoute, (c) => centerController.createCenter(c));

// GET /centers
openapiApp.openapi(getAllCentersRoute, (c) => centerController.getAllCenters(c));
