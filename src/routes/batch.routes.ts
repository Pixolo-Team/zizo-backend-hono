// CONTRACTS //
import { createBatchRoute, editBatchRoute } from '@/contracts/batch.contract';

// CONTROLLERS //
import { batchController } from '@/controllers/batch.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /batch/create
openapiApp.openapi(createBatchRoute, (c) => batchController.createBatch(c));

// PATCH /batch/edit/{batch_id}
openapiApp.openapi(editBatchRoute, (c) => batchController.editBatch(c));
