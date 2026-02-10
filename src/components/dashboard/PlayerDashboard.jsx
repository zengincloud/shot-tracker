import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERIOD_OPTIONS } from '../../constants/keymap';
import { calculatePlayerStats } from '../../utils/stats';
import StatTable from './StatTable';
import TabBar from '../layout/TabBar';

export default function PlayerDashboard({ gameOverride = null }) {
  const { state } = useAppContext();
  const game = gameOverride || state.activeGame;
  const [teamFilter, setTeamFilter] = useState(null);
  const [periodFilter, setPeriodFilter] = useState(null);

  if (!game) return <p className="text-muted">No active game</p>;

  const team1 = state.teams.find(t => t.id === game.team1_id);
  const team2 = state.teams.find(t => t.id === game.team2_id);
  const shots = game.shots || [];
  const filterTeamId = teamFilter || game.team1_id;
  const filterTeam = state.teams.find(t => t.id === filterTeamId);

  const format = PERIOD_OPTIONS.find(p => p.id === game.period_format);
  const periods = format?.periods || ['Q1', 'Q2', 'Q3', 'Q4'];

  const playersWithShots = (filterTeam?.players || [])
    .map(p => ({
      ...p,
      stats: calculatePlayerStats(shots, p.id, periodFilter),
    }))
    .filter(p => p.stats.totalShots > 0)
    .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);

  return (
    <div className="player-dashboard">
      {!gameOverride && <TabBar />}
      <h2>Player Stats</h2>
      <p className="section-desc">View individual player shooting breakdowns. Filter by team and period. Players are sorted by points scored.</p>

      <div className="dashboard-filters">
        <div className="team-filter">
          <button
            className={`btn btn-xs ${filterTeamId === game.team1_id ? 'btn-primary' : ''}`}
            onClick={() => setTeamFilter(game.team1_id)}
          >
            {team1?.name || 'Team 1'}
          </button>
          <button
            className={`btn btn-xs ${filterTeamId === game.team2_id ? 'btn-primary' : ''}`}
            onClick={() => setTeamFilter(game.team2_id)}
          >
            {team2?.name || 'Team 2'}
          </button>
        </div>
        <div className="period-filter">
          <button
            className={`btn btn-xs ${!periodFilter ? 'btn-primary' : ''}`}
            onClick={() => setPeriodFilter(null)}
          >
            All
          </button>
          {periods.map(p => (
            <button
              key={p}
              className={`btn btn-xs ${periodFilter === p ? 'btn-primary' : ''}`}
              onClick={() => setPeriodFilter(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {playersWithShots.length === 0 ? (
        <p className="text-muted">No shots recorded for this team yet</p>
      ) : (
        <div className="player-stats-list">
          {playersWithShots.map(p => (
            <StatTable
              key={p.id}
              stats={p.stats}
              label={`#${p.number} ${p.name} (${p.position})`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
