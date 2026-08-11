import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard: if credentials are missing or still set to placeholder values,
// export a null client so services that hit Supabase fail gracefully
// rather than crashing the entire module graph on startup.
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key');

if (!isConfigured) {
  console.warn(
    '[supabase] Credentials not configured. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env ' +
      'to enable live data. Falling back to mock data.',
  );
}

const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;
