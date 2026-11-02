import { NextResponse } from "next/server";
import { auth } from "@/lib/supabase";
import { safePath } from "../signin/route";

// Google sends the player back here; trading the one-time code for a session
// sets the sign-in cookies, then we return them to where they started.
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const next = safePath(searchParams.get("next"));
  const code = searchParams.get("code");
  if (code) {
    const { error } = await (await auth()).exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}${next}?signin=failed`);
}
