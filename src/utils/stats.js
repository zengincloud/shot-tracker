function pct(made, attempted) {
  if (attempted === 0) return 0;
  return Math.round((made / attempted) * 1000) / 10;
}

function shotStats(shots) {
  const made = shots.filter(s => s.result === 'made').length;
  return { made, attempted: shots.length, pct: pct(made, shots.length) };
}

export function calculateTeamStats(shots, teamId, period = null) {
  let teamShots = shots.filter(s => s.team_id === teamId);
  if (period) teamShots = teamShots.filter(s => s.period === period);

  const twos = teamShots.filter(s => s.shot_type === '2pt');
  const threes = teamShots.filter(s => s.shot_type === '3pt');
  const fts = teamShots.filter(s => s.shot_type === 'ft');
  const fg = [...twos, ...threes];

  const twoStats = shotStats(twos);
  const threeStats = shotStats(threes);
  const ftStats = shotStats(fts);
  const fgStats = shotStats(fg);

  return {
    twoPoint: twoStats,
    threePoint: threeStats,
    freeThrow: ftStats,
    fieldGoal: fgStats,
    totalPoints: (twoStats.made * 2) + (threeStats.made * 3) + ftStats.made,
    totalShots: teamShots.length,
  };
}

export function calculatePlayerStats(shots, playerId, period = null) {
  let playerShots = shots.filter(s => s.player_id === playerId);
  if (period) playerShots = playerShots.filter(s => s.period === period);

  const twos = playerShots.filter(s => s.shot_type === '2pt');
  const threes = playerShots.filter(s => s.shot_type === '3pt');
  const fts = playerShots.filter(s => s.shot_type === 'ft');
  const fg = [...twos, ...threes];

  const twoStats = shotStats(twos);
  const threeStats = shotStats(threes);
  const ftStats = shotStats(fts);
  const fgStats = shotStats(fg);

  return {
    twoPoint: twoStats,
    threePoint: threeStats,
    freeThrow: ftStats,
    fieldGoal: fgStats,
    totalPoints: (twoStats.made * 2) + (threeStats.made * 3) + ftStats.made,
    totalShots: playerShots.length,
  };
}

export function calculateZoneStats(shots, teamId, period = null) {
  let teamShots = shots.filter(s => s.team_id === teamId);
  if (period) teamShots = teamShots.filter(s => s.period === period);

  const zones = {};
  for (const shot of teamShots) {
    if (!zones[shot.zone]) zones[shot.zone] = [];
    zones[shot.zone].push(shot);
  }

  const result = {};
  for (const [zone, zoneShotList] of Object.entries(zones)) {
    result[zone] = shotStats(zoneShotList);
  }
  return result;
}
