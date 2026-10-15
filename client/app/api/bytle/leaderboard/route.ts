import { accountsReady, currentUser, db } from "@/lib/supabase";

// The global Bytle leaderboard: top players by points, plus where you stand.
export async function GET() {
  if (!accountsReady()) return Response.json({ top: [], me: null });
  const columns = "name, points, wins, days, rank";
  const top = await db()
    .from("bytle_leaderboard")
    .select(columns)
    .order("points", { ascending: false })
    .order("wins", { ascending: false })
    .order("name")
    .limit(50);
  if (top.error) throw top.error;

  const user = await currentUser();
  const me = user ? (await db().from("bytle_leaderboard").select(columns).eq("player_id", user.id).maybeSingle()).data : null;
  return Response.json({ top: top.data, me });
}
