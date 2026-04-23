// CONTRACTS //
import { createCenterRoute, editCenterRoute } from '@/contracts/center.contract';

// CONTROLLERS //
import { centerController } from '@/controllers/center.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /centers/create
openapiApp.openapi(createCenterRoute, (c) => centerController.createCenter(c));

// PATCH /centers/edit/:center_id
openapiApp.openapi(editCenterRoute, (c) => centerController.editCenter(c));
