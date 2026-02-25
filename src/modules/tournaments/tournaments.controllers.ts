import type { Context } from "hono";
import { sendResponse } from "../../lib/response.js";
import { getTournamentsService } from "./tournaments.services.js";
import type { TournamentFiltersData } from "./tournaments.types.js";

/**
 * Handles GET /tournaments — returns a filtered, paginated list of tournaments.
 *
 * @param c - Hono request context
 */
export const getTournaments = async (c: Context): Promise<Response> => {
  const q = c.req.query();

  const filters: TournamentFiltersData = {
    city: q.city,
    area: q.area,
    age_category: q.age_category,
    gender: q.gender,
    tournament_format: q.tournament_format,
    format: q.format,
    ground_type: q.ground_type,
    entry_fee_min:
      q.entry_fee_min !== undefined ? Number(q.entry_fee_min) : undefined,
    entry_fee_max:
      q.entry_fee_max !== undefined ? Number(q.entry_fee_max) : undefined,
    has_cash_prize:
      q.has_cash_prize !== undefined ? q.has_cash_prize === "true" : undefined,
    start_date: q.start_date,
    end_date: q.end_date,
    search_text: q.search_text,
    page: q.page !== undefined ? Number(q.page) : undefined,
    page_size: q.page_size !== undefined ? Number(q.page_size) : undefined,
  };

  const result = await getTournamentsService(filters);

  if (result.error) {
    return sendResponse(c, null, 500, "Failed to fetch tournaments", result.error.message);
  }

  return sendResponse(c, result.data, 200, "Tournaments fetched successfully");
};
