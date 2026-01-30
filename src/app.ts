// OTHERS //
import { Hono } from 'hono';
// import { tournamentsRoute } from '@/modules/tournaments/tournaments.routes.js';
import { identityRoute } from '@/modules/identities/identities.routes.js';


export const app = new Hono()
app.get('/', (c) => c.text('Hello World!'));
// Mount identities routes at /identities
app.route('/identities', identityRoute)