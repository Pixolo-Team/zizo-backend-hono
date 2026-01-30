// OTHERS //
import { Hono } from 'hono';
// ROUTE FILES //
import { identityRoute } from '@/modules/identities/identities.routes.js';
import { tournamentRoute } from './modules/tournaments/tournaments.routes.js';

// HONO INSTANCE //
export const app = new Hono()

// TESTING ROUTE //
app.get('/', (c) => c.text('Hello World!'));

// ROUTE:getAllIdentities //
app.route('/identities', identityRoute)

// ROUTE:getAllTournaments //
app.route('/getAllTournaments', tournamentRoute)