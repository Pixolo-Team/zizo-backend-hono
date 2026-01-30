// OTHERS //
import { Hono } from 'hono';
// ROUTE FILES //
import { identityRoute } from '@/modules/identities/identities.routes.js';

// HONO INSTANCE //
export const app = new Hono()

// TESTING ROUTE //
app.get('/', (c) => c.text('Hello World!'));

// ROUTE:getAllIdentities //
app.route('/identities', identityRoute)