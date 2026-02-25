// Tournments Table
export interface Tournament {
  id: string;
  series_id?: string | null;
  age_category: string;
  format: string;
  gender: string;
  tournament_format: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  start_date: string;
  start_time?: string | null;
  end_date: string;
  end_time?: string | null;
  entry_fee?: string | null;
  advance_fee?: string | null;
  prizes_text?: string | null;
  cash_prize_total?: string | null;
  winning_prizes?: string | null;
  awards?: string | null;
  registration_deadline?: string | null;
  match_days_text?: string | null;
  min_matches?: string | null;
  playing_team_size?: string | null;
  total_team_size?: string | null;
  min_players?: string | null;
  max_players?: string | null;
  slot_status?: string | null;
  status?: string | null;
  created_at?: string | null;
  rules_text?: string | null;
  age_cutoff_date?: string | null;
  external_ref_id?: string | null;
}

export interface TournamentData {
  id: string;
  series_id: string;
  age_category: string;
  format: string;
  gender: string;
  tournament_format: string;

  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;

  entry_fee: number;
  advance_fee: number;
  prizes_text: string;
  cash_prize_total: number;
  winning_prizes: string[];
  awards: string[];

  contact_name: string;
  contact_phone: string;

  registration_deadline: string;
  match_days_text: string;

  min_matches: number;
  playing_team_size: number;
  total_team_size: number;
  min_players: number;
  max_players: number;

  slot_status: string;
  status: string;
  created_at: string;
}

export interface SeriesData {
  id: string;
  name: string;
  city: string;
  area: string;
  ground_name: string;
  ground_type: string;
  poster_url: string;
  status: string;
}

export interface OrganizerData {
  id: string;
  name: string;
  type: string;
  description: string;
  logo_url: string;
}

export interface OrganizerMediaData {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface OrganizerTestimonialData {
  id: string;
  quote: string;
  author_name: string | null;
  author_role: string | null;
}

export interface SponsorData {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

export interface TournamentDetailsData {
  tournament: TournamentData;
  otherTournaments: Partial<TournamentData>[];
  series: SeriesData;
  organizer: OrganizerData | null;
  organizer_media: OrganizerMediaData[];
  organizer_testimonials: OrganizerTestimonialData[];
  sponsors: SponsorData[];
}

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

// Filters
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
