-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Teams
create table teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table teams enable row level security;
create policy "Users can manage own teams" on teams
  for all using (auth.uid() = user_id);

-- Players
create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams on delete cascade not null,
  number int not null,
  name text not null,
  position text default 'PG',
  is_starter boolean default false
);

alter table players enable row level security;
create policy "Users can manage players on own teams" on players
  for all using (
    team_id in (select id from teams where user_id = auth.uid())
  );

-- Games
create table games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  team1_id uuid references teams not null,
  team2_id uuid references teams not null,
  date date not null default current_date,
  status text not null default 'active',
  period_format text default '4q',
  current_period text default 'Q1',
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table games enable row level security;
create policy "Users can manage own games" on games
  for all using (auth.uid() = user_id);

-- Shots
create table shots (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games on delete cascade not null,
  player_id uuid references players not null,
  team_id uuid references teams not null,
  shot_type text not null,
  zone text not null,
  result text not null,
  period text default 'Q1',
  created_at timestamptz default now()
);

alter table shots enable row level security;
create policy "Users can manage shots in own games" on shots
  for all using (
    game_id in (select id from games where user_id = auth.uid())
  );
