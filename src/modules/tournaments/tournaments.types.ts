/**
 * Shape of a single tournament card returned to the client.
 */
export interface TournamentListingItemData {
  tournament_id: string;
  tournament_name: string;
  age_categories: string[];
  format: string;
  gender: string;
  tournament_format: string;
  entry_fee: number;
  cash_prize_total: number;
  slot_status: string;
  start_date: string;
  end_date: string;
  city: string;
  area: string;
  ground_type: string;
  poster_url: string;
  organizer_name: string | null;
}

/**
 * All supported query filter parameters for the tournament listing endpoint.
 */
export interface TournamentFiltersData {
  city?: string;
  area?: string;
  age_category?: string;
  gender?: string;
  tournament_format?: string;
  format?: string;
  ground_type?: string;
  entry_fee_min?: number;
  entry_fee_max?: number;
  has_cash_prize?: boolean;
  start_date?: string;
  end_date?: string;
  search_text?: string;
  page?: number;
  page_size?: number;
}

/**
 * Raw row shape returned by the Supabase tournament join query.
 */
export interface RawTournamentRow {
  id: string;
  age_category: string;
  format: string;
  gender: string;
  tournament_format: string;
  entry_fee: number;
  cash_prize_total: number;
  slot_status: string;
  start_date: string;
  end_date: string;
  tournament_series: {
    id: string;
    name: string;
    city: string;
    area: string;
    ground_type: string;
    poster_url: string;
    organizers: { name: string | null } | { name: string | null }[] | null;
  };
}
