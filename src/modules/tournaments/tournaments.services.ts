// TYPES //
import type { QueryResponseData } from "../../common/types/query.response.type.js";
import type {
  TournamentFiltersData,
  TournamentListingItemData,
  RawTournamentRow,
} from "./tournaments.types.js";

// UTILS //
import { toSnakeCase } from "../../common/utils/string.util.js";

// OTHERS //
import { supabase } from "../../config/supabase.js";

/**
 * Fetch filtered and paginated tournaments grouped by tournament_series.
 * @param filters - TournamentFiltersData query parameters
 * @returns Promise with QueryResponseData containing TournamentListingItemData array
 */
export const getTournamentsService = async (
  filters: TournamentFiltersData,
): Promise<QueryResponseData<TournamentListingItemData[]>> => {
  try {
    const page = filters.page ?? 1;
    const pageSize = filters.page_size ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("tournaments")
      .select(
        `id, age_category, format, gender, tournament_format, entry_fee, cash_prize_total, slot_status, start_date, end_date,
        tournament_series!inner (id, name, city, area, ground_type, poster_url, organizers (name))`,
        { count: "exact" },
      )
      .eq("status", "published");

    if (filters.city) query = query.eq("tournament_series.city", filters.city);
    if (filters.area) query = query.eq("tournament_series.area", filters.area);
    if (filters.age_category) query = query.eq("age_category", filters.age_category);
    if (filters.gender) query = query.eq("gender", filters.gender);
    if (filters.format) query = query.eq("format", filters.format);
    if (filters.tournament_format)
      query = query.eq("tournament_format", toSnakeCase(filters.tournament_format));
    if (filters.ground_type)
      query = query.eq("tournament_series.ground_type", filters.ground_type);
    if (filters.entry_fee_min !== undefined)
      query = query.gte("entry_fee", filters.entry_fee_min);
    if (filters.entry_fee_max !== undefined)
      query = query.lte("entry_fee", filters.entry_fee_max);
    if (filters.has_cash_prize === true) query = query.gt("cash_prize_total", 0);
    if (filters.start_date) query = query.gte("start_date", filters.start_date);
    if (filters.end_date) query = query.lte("end_date", filters.end_date);
    if (filters.search_text) {
      const search = filters.search_text.trim();
      query = query.or(`name.ilike.%${search}%`, {
        foreignTable: "tournament_series",
      });
    }

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    const rows = data as RawTournamentRow[];
    const groupedBySeries = new Map<string, TournamentListingItemData>();

    for (const t of rows) {
      const series = t.tournament_series[0];
      if (!series) continue;
      const seriesId = series.id;
      const existing = groupedBySeries.get(seriesId);

      if (!existing) {
        groupedBySeries.set(seriesId, {
          tournament_id: t.id,
          tournament_name: series.name,
          age_categories: [t.age_category],
          format: t.format,
          gender: t.gender,
          tournament_format: t.tournament_format,
          entry_fee: t.entry_fee,
          cash_prize_total: t.cash_prize_total,
          slot_status: t.slot_status,
          start_date: t.start_date,
          end_date: t.end_date,
          city: series.city,
          area: series.area,
          ground_type: series.ground_type,
          poster_url: series.poster_url,
          organizer_name: series.organizers[0]?.name ?? null,
        });
      } else if (!existing.age_categories.includes(t.age_category)) {
        existing.age_categories.push(t.age_category);
      }
    }

    return { data: Array.from(groupedBySeries.values()), error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
