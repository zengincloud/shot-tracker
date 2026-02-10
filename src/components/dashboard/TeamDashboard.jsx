import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERIOD_OPTIONS } from '../../constants/keymap';
import { calculateTeamStats } from '../../utils/stats';
import StatTable from './StatTable';
import TabBar from '../layout/TabBar';

export default function TeamDashboard({ gameOverride = null }) {
  const { state } = useAppContext();
  const game = gameOverride || state.activeGame;
  const [periodFilter, setPeriodFilter] = useState(null);

  if (!game) return <p className="text-muted">No active game</p>;

  const team1 = state.teams.find(t => t.id === game.team1_id);
  const team2 = state.teams.find(t => t.id === game.team2_id);
  const shots = game.shots || [];

  const stats1 = calculateTeamStats(shots, game.team1_id, periodFilter);
  const stats2 = calculateTeamStats(shots, game.team2_id, periodFilter);

  const format = PERIOD_OPTIONS.find(p => p.id === game.period_format);
  const periods = format?.periods || ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="team-dashboard">
      {!gameOverride && <TabBar />}
      <h2>Team Stats</h2>
      <p className="section-desc">Compare shooting stats between both teams. Use the period filter to narrow down by quarter or half.</p>

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

      <div className="dashboard-grid">
        <StatTable stats={stats1} label={team1?.name || 'Team 1'} />
        <StatTable stats={stats2} label={team2?.name || 'Team 2'} />
      </div>

      <div className="score-summary">
        <span className={stats1.totalPoints > stats2.totalPoints ? 'leading' : ''}>
          {team1?.name}: {stats1.totalPoints}
        </span>
        <span className="score-divider">—</span>
        <span className={stats2.totalPoints > stats1.totalPoints ? 'leading' : ''}>
          {team2?.name}: {stats2.totalPoints}
        </span>
      </div>
    </div>
  );
}
