-- Bytle accounts, daily games and the global leaderboard.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- Nothing here is readable or writable from the browser: row level security
-- is on with no policies, so only the website's server (service role key)
-- touches these tables, after it has checked who is signed in.

-- one row per Google account that has played
create table if not exists public.players (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);

-- one row per player per day: opening the game that day creates it
create table if not exists public.bytle_days (
  player_id uuid not null references public.players (id) on delete cascade,
  day int not null,
  guesses text[] not null default '{}',
  status text not null default 'playing' check (status in ('playing', 'won', 'lost')),
  -- 1 for logging in that day, plus (tries left + 1) for solving it
  points int not null default 1 check (points >= 0),
  updated_at timestamptz not null default now(),
  primary key (player_id, day)
);
create index if not exists bytle_days_day on public.bytle_days (day);

alter table public.players enable row level security;
alter table public.bytle_days enable row level security;
revoke all on public.players, public.bytle_days from anon, authenticated;

-- totals per player, ranked (ties share a rank)
create or replace view public.bytle_leaderboard with (security_invoker = true) as
select
  p.id as player_id,
  p.name,
  coalesce(sum(d.points), 0)::int as points,
  (count(d.day) filter (where d.status = 'won'))::int as wins,
  count(d.day)::int as days,
  (rank() over (order by coalesce(sum(d.points), 0) desc))::int as rank
from public.players p
left join public.bytle_days d on d.player_id = p.id
group by p.id, p.name;

revoke all on public.bytle_leaderboard from anon, authenticated;
