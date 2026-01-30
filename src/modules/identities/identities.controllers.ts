import type { Context } from 'hono'
import { getIdentitiesService } from '@/modules/identities/identities.services.js'

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