import { supabase } from '../lib/supabase';

// ── Teams ──

export async function fetchTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*, players(*)')
    .order('name');
  if (error) throw error;
  return data;
}

export async function createTeam(name) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('teams')
    .insert({ name, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return { ...data, players: [] };
}

export async function updateTeam(id, updates) {
  const { data, error } = await supabase
    .from('teams')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTeam(id) {
  const { error } = await supabase.from('teams').delete().eq('id', id);
  if (error) throw error;
}

// ── Players ──

export async function addPlayer(teamId, player) {
  const { data, error } = await supabase
    .from('players')
    .insert({ team_id: teamId, ...player })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePlayer(id, updates) {
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlayer(id) {
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) throw error;
}

// ── Games ──

export async function fetchGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*, shots(*)')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createGame(team1Id, team2Id, date, periodFormat) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('games')
    .insert({
      user_id: user.id,
      team1_id: team1Id,
      team2_id: team2Id,
      date,
      status: 'active',
      period_format: periodFormat,
      current_period: periodFormat === '4q' ? 'Q1' : 'H1',
    })
    .select()
    .single();
  if (error) throw error;
  return { ...data, shots: [] };
}

export async function updateGame(id, updates) {
  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw error;
}

// ── Shots ──

export async function addShot(shot) {
  const { data, error } = await supabase
    .from('shots')
    .insert(shot)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteShot(id) {
  const { error } = await supabase.from('shots').delete().eq('id', id);
  if (error) throw error;
}

// ── History ──

export async function fetchGamesVsOpponent(team2Id) {
  const { data, error } = await supabase
    .from('games')
    .select('*, shots(*)')
    .eq('team2_id', team2Id)
    .eq('status', 'completed')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}
