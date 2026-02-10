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

  // Build period-by-period scores with half aggregates for 4-quarter games
  const periodScores = [];
  let running1 = 0, running2 = 0;

  periods.forEach((period, i) => {
    const p1 = calculateTeamStats(shots, game.team1_id, period);
    const p2 = calculateTeamStats(shots, game.team2_id, period);
    running1 += p1.totalPoints;
    running2 += p2.totalPoints;
    periodScores.push({
      period, team1Pts: p1.totalPoints, team2Pts: p2.totalPoints,
      cum1: running1, cum2: running2,
    });

    // Insert half aggregate after Q2 and Q4 in 4-quarter format
    if (game.period_format === '4q' && (i === 1 || i === 3)) {
      const halfLabel = i === 1 ? 'H1' : 'H2';
      const startIdx = i === 1 ? 0 : 2;
      let h1 = 0, h2 = 0;
      for (let j = startIdx; j <= i; j++) {
        h1 += calculateTeamStats(shots, game.team1_id, periods[j]).totalPoints;
        h2 += calculateTeamStats(shots, game.team2_id, periods[j]).totalPoints;
      }
      periodScores.push({
        period: halfLabel, team1Pts: h1, team2Pts: h2,
        cum1: running1, cum2: running2, isHalf: true,
      });
    }
  });

  // Check if OT shots exist
  const otStats1 = calculateTeamStats(shots, game.team1_id, 'OT');
  const otStats2 = calculateTeamStats(shots, game.team2_id, 'OT');
  if (otStats1.totalShots > 0 || otStats2.totalShots > 0) {
    const lastCum = periodScores[periodScores.length - 1];
    periodScores.push({
      period: 'OT',
      team1Pts: otStats1.totalPoints,
      team2Pts: otStats2.totalPoints,
      cum1: (lastCum?.cum1 || 0) + otStats1.totalPoints,
      cum2: (lastCum?.cum2 || 0) + otStats2.totalPoints,
    });
  }

  const hasPeriodData = periodScores.some(p => p.team1Pts > 0 || p.team2Pts > 0);

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

      {hasPeriodData && (
        <div className="period-breakdown">
          <h3 className="section-title">Score by Period</h3>
          <table className="stat-table">
            <thead>
              <tr>
                <th></th>
                {periodScores.map(p => (
                  <th key={p.period} className={p.isHalf ? 'half-col' : ''}>{p.period}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="stat-category">{team1?.name}</td>
                {periodScores.map(p => (
                  <td key={p.period} className={p.isHalf ? 'half-col' : ''}>{p.team1Pts}</td>
                ))}
                <td className="stat-made">{calculateTeamStats(shots, game.team1_id).totalPoints}</td>
              </tr>
              <tr>
                <td className="stat-category">{team2?.name}</td>
                {periodScores.map(p => (
                  <td key={p.period} className={p.isHalf ? 'half-col' : ''}>{p.team2Pts}</td>
                ))}
                <td className="stat-made">{calculateTeamStats(shots, game.team2_id).totalPoints}</td>
              </tr>
              <tr className="stat-total-row">
                <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cumulative</td>
                {periodScores.map(p => (
                  <td key={p.period} className={p.isHalf ? 'half-col' : ''} style={{ fontSize: '0.75rem' }}>
                    {p.cum1}-{p.cum2}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
