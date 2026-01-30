// DEFINITION OF TOURNAMENT TABLE //
export type Tournament = {
  id: string
  series_id?: string | null
  age_category: string
  format: string
  gender: string
  tournament_format: string
  contact_name?: string | null
  contact_phone?: string | null
  start_date: string
  start_time?: string | null
  end_date: string
  end_time?: string | null
  entry_fee?: string | null
  advance_fee?: string | null
  prizes_text?: string | null
  cash_prize_total?: string | null
  winning_prizes?: string | null
  awards?: string | null
  registration_deadline?: string | null
  match_days_text?: string | null
  min_matches?: string | null
  playing_team_size?: string | null
  total_team_size?: string | null
  min_players?: string | null
  max_players?: string | null
  slot_status?: string | null
  status?: string | null
  created_at?: string | null
  rules_text?: string | null
  age_cutoff_date?: string | null
  external_ref_id?: string | null
}