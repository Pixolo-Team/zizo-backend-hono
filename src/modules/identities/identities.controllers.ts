// OTHER //
import type { Context } from 'hono'

// IDENTITY SERVICE FILE //
import { getIdentitiesService } from '@/modules/identities/identities.services.js'

// GET IDENTITIES CONTROLLER //
export const getIdentitiesController = async (c: Context) => {
  const result = await getIdentitiesService()

  if (result.error) {
    return c.json(
      { error: result.error.message },
      500
    )
  }

  return c.json(result.data)
}