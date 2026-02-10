import { useAppContext } from '../../context/AppContext';
import { calculateTeamStats, calculatePlayerStats } from '../../utils/stats';
import TeamDashboard from '../dashboard/TeamDashboard';
import PlayerDashboard from '../dashboard/PlayerDashboard';

export default function GameDetail() {
  const { state, dispatch } = useAppContext();
  const game = state.games.find(g => g.id === state.selectedGameId);

  if (!game) return <p className="text-muted">Game not found</p>;

  const team1 = state.teams.find(t => t.id === game.team1_id);
  const team2 = state.teams.find(t => t.id === game.team2_id);
  const shots = game.shots || [];

  const stats1 = calculateTeamStats(shots, game.team1_id);
  const stats2 = calculateTeamStats(shots, game.team2_id);

  const winner = stats1.totalPoints > stats2.totalPoints ? team1 : stats2.totalPoints > stats1.totalPoints ? team2 : null;
  const isDraw = stats1.totalPoints === stats2.totalPoints && shots.length > 0;

  // Find top scorer
  const allPlayers = [...(team1?.players || []), ...(team2?.players || [])];
  let topScorer = null;
  let topPoints = 0;
  for (const p of allPlayers) {
    const ps = calculatePlayerStats(shots, p.id);
    if (ps.totalPoints > topPoints) {
      topPoints = ps.totalPoints;
      topScorer = p;
    }
  }

  // Brief narrative
  const margin = Math.abs(stats1.totalPoints - stats2.totalPoints);
  let narrative = '';
  if (shots.length === 0) {
    narrative = '';
  } else if (isDraw) {
    narrative = 'A hard-fought game ending in a draw.';
  } else if (margin >= 20) {
    narrative = `Dominant performance by ${winner?.name} winning by ${margin}.`;
  } else if (margin >= 10) {
    narrative = `Comfortable win for ${winner?.name} by ${margin} points.`;
  } else if (margin >= 5) {
    narrative = `Solid win for ${winner?.name}, leading by ${margin}.`;
  } else {
    narrative = `A close contest decided by just ${margin} point${margin === 1 ? '' : 's'}.`;
  }

  return (
    <div className="game-detail">
      <button className="btn btn-sm" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'history' })}>
        &larr; Back to History
      </button>
      <h2>{team1?.name} vs {team2?.name} — {game.date}</h2>

      {shots.length > 0 && (
        <div className="game-summary">
          <div className="summary-score">
            <span className={stats1.totalPoints >= stats2.totalPoints ? 'summary-winner' : ''}>
              {team1?.name} {stats1.totalPoints}
            </span>
            <span className="summary-dash">&mdash;</span>
            <span className={stats2.totalPoints >= stats1.totalPoints ? 'summary-winner' : ''}>
              {stats2.totalPoints} {team2?.name}
            </span>
          </div>
          {narrative && <p className="summary-narrative">{narrative}</p>}
          <div className="summary-details">
            {winner && <span className="summary-tag summary-win">{winner.name} wins</span>}
            {isDraw && <span className="summary-tag">Draw</span>}
            <span className="summary-tag">{shots.length} shots</span>
            <span className="summary-tag">FG: {stats1.fieldGoal.pct}% vs {stats2.fieldGoal.pct}%</span>
            <span className="summary-tag">3PT: {stats1.threePoint.pct}% vs {stats2.threePoint.pct}%</span>
            <span className="summary-tag">FT: {stats1.freeThrow.pct}% vs {stats2.freeThrow.pct}%</span>
            {topScorer && <span className="summary-tag">Top scorer: #{topScorer.number} {topScorer.name} ({topPoints} pts)</span>}
          </div>
        </div>
      )}

      <TeamDashboard gameOverride={game} />
      <PlayerDashboard gameOverride={game} />
    </div>
  );
}
