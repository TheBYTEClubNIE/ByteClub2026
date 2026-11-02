import { NextResponse } from "next/server";
import { accountsReady, auth } from "@/lib/supabase";

// The "Sign out" button posts here; it clears the sign-in cookies.
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  if (accountsReady()) await (await auth()).signOut();
  return NextResponse.redirect(`${origin}/bytle`, { status: 303 });
}
