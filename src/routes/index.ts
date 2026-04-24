// ROUTES //
import '@/routes/docs.routes';
import '@/routes/health.routes';
import '@/routes/auth.routes';
import '@/routes/organizer.routes';
import '@/routes/user.routes';
import '@/routes/issue-tickets.routes';
import '@/routes/invite.routes';
import '@/routes/batch.routes';
import { openapiApp } from '@/routes/openapi.routes';

/**
 * Register all application routes
 */

export default openapiApp;
