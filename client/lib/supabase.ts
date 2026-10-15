import { createServerClient } from "@supabase/ssr";
import { createClient, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Server only. Google sign-in runs through Supabase Auth; the session lives in
// Supabase's own cookies and every request re-checks it with Supabase, so a
// forged or expired session simply counts as signed out.

export const accountsReady = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);

// Supabase Auth bound to this request's cookies (it refreshes them when needed).
export async function auth() {
  const store = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => store.set(name, value, options)),
    },
  }).auth;
}

export async function currentUser(): Promise<User | null> {
  const { data } = await (await auth()).getUser();
  return data.user;
}

// The name players see on the leaderboard: their Google account name.
export function googleName(user: User) {
  const m = user.user_metadata ?? {};
  const name = String(m.full_name || m.name || "").trim();
  return (name || "Player").slice(0, 80);
}

// Database access that bypasses row level security: only call it after
// currentUser() has said who is asking.
export const db = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
