// TYPES //
import type { Context } from "hono";
import type { TournamentFiltersData } from "./tournaments.types.js";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { getTournamentsService } from "./tournaments.services.js";

/**
 * Safely converts a query string value to a number, returning undefined for invalid input.
 * @param value - Raw query string value
 * @returns Parsed number or undefined
 */
const toNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};

/**
 * Controller to get filtered and paginated tournaments.
 * @param c - Hono Context
 * @returns Promise with JSON response
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
    entry_fee_min: toNumber(q.entry_fee_min),
    entry_fee_max: toNumber(q.entry_fee_max),
    has_cash_prize: q.has_cash_prize === "true" ? true : undefined,
    start_date: q.start_date,
    end_date: q.end_date,
    search_text: q.search_text,
    page: toNumber(q.page),
    page_size: toNumber(q.page_size),
  };

  const result = await getTournamentsService(filters);

  if (result.error) {
    return sendResponse(
      c,
      null,
      500,
      "Failed to fetch tournaments",
      result.error.message,
    );
  }

  return sendResponse(c, result.data, 200, "Tournaments fetched successfully");
};
