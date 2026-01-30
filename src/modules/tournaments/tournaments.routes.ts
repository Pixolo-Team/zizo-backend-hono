// OTHERS //
import { Hono } from 'hono'

// TOURNAMENT CONTROLLER FILE //
import { getTournamentsController } from './tournaments.controllers.js';

// MAKING HONO INSTANCE FOR ROUTES //
export const tournamentRoute = new Hono()

// GET IDENTITIES ROUTE //
tournamentRoute.get('/', getTournamentsController);