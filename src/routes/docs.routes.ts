import { swaggerUI } from '@hono/swagger-ui';
import { openapiApp } from '@/routes/openapi.routes';

console.log('DOCS ROUTES REGISTERED');

// Swagger UI page
openapiApp.get(
  '/docs',
  swaggerUI({
    url: '/openapi.json',
  })
);

/**
 * OpenAPI JSON
 */
openapiApp.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Zizo API',
    version: '1.0.0',
  },
});
