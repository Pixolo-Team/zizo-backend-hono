// CONTRACTS //
import { createBatchRoute } from '@/contracts/batch.contract';

// CONTROLLERS //
import { batchController } from '@/controllers/batch.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /batch/create
openapiApp.openapi(createBatchRoute, (c) => batchController.createBatch(c));
