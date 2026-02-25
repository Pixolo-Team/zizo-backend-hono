// TYPES //
import { QueryResponseData } from "../../common/types/query.response.type.js";
import {
  Tournament,
  TournamentDetailsData,
  TournamentData,
  SeriesData,
  OrganizerData,
  OrganizerMediaData,
  OrganizerTestimonialData,
  SponsorData,
} from "./tournaments.types.js";

// OTHERS //
import { supabase } from "../../config/supabase.js";

/** Internal: organizer with nested media and testimonials */
interface OrganizerWithRelations extends OrganizerData {
  organizer_media: OrganizerMediaData[];
  organizer_testimonials: OrganizerTestimonialData[];
}

/** Internal: a single row from tournament_sponsor join */
interface TournamentSponsorRow {
  sponsors: SponsorData;
}

/** Internal: raw series data with nested relations */
interface TournamentSeriesRaw extends SeriesData {
  tournaments: Partial<TournamentData>[];
  organizers: OrganizerWithRelations | null;
  tournament_sponsor: TournamentSponsorRow[];
}

/** Internal: raw tournament row with nested series */
interface TournamentRaw extends TournamentData {
  tournament_series: TournamentSeriesRaw | null;
}

/**
 * Fetch all tournaments from the database
 * @returns Promise with QueryResponseData
 */
export const getTournamentsService = async (): Promise<
  QueryResponseData<Tournament[]>
> => {
  try {
    const { data, error } = await supabase.from("tournaments").select("*");

    if (error) {
      throw error;
    }

    return {
      data: data as Tournament[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};

/**
 * Fetch full tournament details by ID from the database
 * @param tournamentId - The UUID of the tournament
 * @returns Promise with QueryResponseData containing TournamentDetailsData
 */
export const getTournamentDetailsService = async (
  tournamentId: string,
): Promise<QueryResponseData<TournamentDetailsData>> => {
  try {
    const { data, error } = await supabase
      .from("tournaments")
      .select(
        `id, series_id, age_category, format, gender, tournament_format,
        start_date, start_time, end_date, end_time,
        entry_fee, advance_fee, prizes_text, cash_prize_total,
        winning_prizes, awards, registration_deadline, match_days_text,
        contact_name, contact_phone,
        min_matches, playing_team_size, total_team_size,
        min_players, max_players, slot_status, status, created_at,
        tournament_series (
          id, name, city, area, ground_name, ground_type, poster_url, status,
          tournaments (
            id, age_category, format, gender, tournament_format,
            entry_fee, cash_prize_total, slot_status, start_date, end_date, status
          ),
          organizers (
            id, name, type, description, logo_url,
            organizer_media (id, image_url, caption, sort_order),
            organizer_testimonials (id, quote, author_name, author_role)
          ),
          tournament_sponsor (
            sponsors (id, name, logo_url, website_url)
          )
        )`,
      )
      .eq("id", tournamentId)
      .eq("status", "published")
      .single();

    if (error) {
      throw error;
    }

    const tournament = data as unknown as TournamentRaw;

    const otherTournaments =
      tournament.tournament_series?.tournaments?.filter(
        (t) => t.status === "published" && t.id !== tournamentId,
      ) ?? [];

    const series: SeriesData = {
      id: tournament.tournament_series?.id ?? "",
      name: tournament.tournament_series?.name ?? "",
      city: tournament.tournament_series?.city ?? "",
      area: tournament.tournament_series?.area ?? "",
      ground_name: tournament.tournament_series?.ground_name ?? "",
      ground_type: tournament.tournament_series?.ground_type ?? "",
      poster_url: tournament.tournament_series?.poster_url ?? "",
      status: tournament.tournament_series?.status ?? "",
    };

    const organizer: OrganizerData | null =
      tournament.tournament_series?.organizers
        ? {
            id: tournament.tournament_series.organizers.id,
            name: tournament.tournament_series.organizers.name,
            type: tournament.tournament_series.organizers.type,
            description: tournament.tournament_series.organizers.description,
            logo_url: tournament.tournament_series.organizers.logo_url,
          }
        : null;

    const organizer_media: OrganizerMediaData[] =
      tournament.tournament_series?.organizers?.organizer_media ?? [];

    const organizer_testimonials: OrganizerTestimonialData[] =
      tournament.tournament_series?.organizers?.organizer_testimonials ?? [];

    const sponsors: SponsorData[] =
      tournament.tournament_series?.tournament_sponsor?.map(
        (row: TournamentSponsorRow) => row.sponsors,
      ) ?? [];

    const tournamentDetails: TournamentDetailsData = {
      tournament,
      otherTournaments,
      series,
      organizer,
      organizer_media,
      organizer_testimonials,
      sponsors,
    };

    return {
      data: tournamentDetails,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};
