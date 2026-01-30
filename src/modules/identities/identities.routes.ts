import { Hono } from 'hono'
import {
  getIdentitiesController
} from '@/modules/identities/identities.controllers.js'


export const identityRoute = new Hono()

identityRoute.get('/', async (c) => {
  console.log('GET /getIdentities called')
  return getIdentitiesController(c)
})