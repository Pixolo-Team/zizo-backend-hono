import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_ANON_KEY ?? "";

/**
 * Shared Supabase client instance for all service queries.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
