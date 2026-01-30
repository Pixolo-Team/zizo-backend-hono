// OTHER //
import type { Context } from 'hono'

// TOURNAMENT SERVICE FILE //
import { getTournamentsService } from '@/modules/tournaments/tournaments.services.js'

// GET IDENTITIES CONTROLLER //
export const getTournamentsController = async (c: Context) => {
  const result = await getTournamentsService()

  if (result.error) {
    return c.json(
      { error: result.error.message },
      500
    )
  }

  return c.json(result.data)
}