// OTHERS //
import { createClient } from "@supabase/supabase-js";

// SUPABASE URL //
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
// SUPABASE ANON KEY //
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

// VALIDATING SUPABASE URL AND ANON KEY //
if (!SUPABASE_URL) {
  throw new Error(
    "Missing Supabase URL. Set PUBLIC_SUPABASE_URL or SUPABASE_URL in your environment. See .env.example for required keys.",
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase anon key. Set PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY in your environment. See .env.example for required keys.",
  );
}

// Creating Supabase Instance as Client //
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
