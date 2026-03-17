import { healthController } from '@/controllers';
import { openapiApp } from './openapi.routes';
import { healthCheckRoute } from '@/contracts/health.contracts';

// GET /health - Health check
openapiApp.openapi(healthCheckRoute, (c) => healthController.healthCheck(c));
