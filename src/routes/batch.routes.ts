// CONTRACTS //
import { createBatchRoute, getBatchesRoute } from '@/contracts/batch.contract';

// CONTROLLERS //
import { batchController } from '@/controllers/batch.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// GET /batches
openapiApp.openapi(getBatchesRoute, (c) => batchController.getBatches(c));

// POST /batch/create
openapiApp.openapi(createBatchRoute, (c) => batchController.createBatch(c));
