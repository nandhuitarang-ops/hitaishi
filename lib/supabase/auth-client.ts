"use client";

import { createClient } from "@supabase/supabase-js";

let _authClient: ReturnType<typeof createClient> | null = null;

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add these to your deployment environment and rebuild."
    );
  }
  return { url, key };
}

/**
 * Returns a Supabase client configured for auth (with session persistence).
 * This is separate from the realtime client which disables sessions.
 */
export function getAuthClient() {
  if (_authClient) return _authClient;
  const { url, key } = getEnv();
  _authClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _authClient;
}
