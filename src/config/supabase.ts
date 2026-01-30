// OTHERS //
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    'Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your environment. See .env.example for required keys.'
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY in your environment. See .env.example for required keys.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);