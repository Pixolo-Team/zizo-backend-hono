import type { Context } from 'hono';

import { errorResponse, successResponse } from '@/common/utils/api.util';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api';
import { getPlayersService } from '@/services/players.service';
import { getPlayersQuerySchema } from '@/validators/players.validator';

export class PlayersController {
  /**
   * GET /players
   * Fetch a filterable list of players for an organization.
   */
  async getPlayers(c: Context) {
    try {
      const user = c.get('user');

      if (!user?.id) {
        return errorResponse(
          c,
          ERROR_MESSAGES.UNAUTHORIZED,
          ERROR_MESSAGES.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const parsedQuery = getPlayersQuerySchema.safeParse(c.req.query());

      if (!parsedQuery.success) {
        const errorMessage = parsedQuery.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION_FAILED;

        return errorResponse(
          c,
          errorMessage,
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.UNPROCESSABLE_ENTITY
        );
      }

      const result = await getPlayersService(user.id, parsedQuery.data);

      if (result.error) {
        if (result.errorCode === 'FORBIDDEN') {
          return errorResponse(
            c,
            'User does not have permission to access this organization',
            'Unauthorized access',
            HTTP_STATUS.FORBIDDEN
          );
        }

        return errorResponse(
          c,
          result.error.message,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(c, result.data, 'Players fetched successfully', HTTP_STATUS.OK);
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      return errorResponse(c, message, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export const playersController = new PlayersController();
