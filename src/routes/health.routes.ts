// CONTRACTS //
import { healthCheckRoute } from '@/contracts/health.contract';

// CONTROLLERS //
import { healthController } from '@/controllers';

// ROUTES //
import { openapiApp } from './openapi.routes';

// GET /health - Health check
openapiApp.openapi(healthCheckRoute, (c) => healthController.healthCheck(c));
