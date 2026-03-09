// SUPABASE //
import { createClient } from '@supabase/supabase-js';

// Fetch the Supabase Creds from EV
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate Key & URL
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Warning: Missing Supabase credentials. Ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set in environment variables.'
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'Warning: Missing Supabase service role key. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment variables.'
  );
}

// Creating Supabase Instance as Client
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession: false,
    },
  }
);

// Creating Supabase Admin Client (service role — bypasses RLS, used for auth.users queries)
export const supabaseAdmin = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
