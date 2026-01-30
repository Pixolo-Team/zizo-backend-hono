// OTHERS //
import { Hono } from 'hono'

// IDENTITY CONTROLLER FILE //
import { getIdentitiesController } from '@/modules/identities/identities.controllers.js'

// MAKING HONO INSTANCE FOR ROUTES //
export const identityRoute = new Hono()

// GET IDENTITIES ROUTE //
identityRoute.get('/', getIdentitiesController);