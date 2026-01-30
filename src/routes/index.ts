import { Hono } from 'hono';
import userRoutes from './user.routes';
import healthRoutes from './health.routes';
import { config } from '@/config';

const routes = new Hono();

/**
 * Register all application routes
 */
routes.route('/health', healthRoutes);
routes.route(`${config.apiPrefix}/${config.apiVersion}/users`, userRoutes);

export default routes;
