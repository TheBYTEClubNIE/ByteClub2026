import { NextResponse } from "next/server";
import { accountsReady, auth } from "@/lib/supabase";

// Only same-site paths, so nobody can bounce a sign-in to another website.
export const safePath = (next: string | null) => (next?.startsWith("/") && !next.startsWith("//") ? next : "/bytle");

// Starts "Sign in with Google": Supabase sends the browser to Google, and
// Google sends it back to /auth/callback.
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  if (!accountsReady()) return NextResponse.redirect(`${origin}/bytle?signin=unavailable`);
  const next = safePath(searchParams.get("next"));
  const { data, error } = await (await auth()).signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`, queryParams: { prompt: "select_account" } },
  });
  if (error || !data.url) return NextResponse.redirect(`${origin}${next}?signin=failed`);
  return NextResponse.redirect(data.url);
}
