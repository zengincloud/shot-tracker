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
          <div className="summary-details">
            {winner && <span className="summary-tag summary-win">{winner.name} wins</span>}
            {isDraw && <span className="summary-tag">Draw</span>}
            <span className="summary-tag">{shots.length} shots</span>
            <span className="summary-tag">FG: {stats1.fieldGoal.pct}% vs {stats2.fieldGoal.pct}%</span>
            {topScorer && <span className="summary-tag">Top scorer: #{topScorer.number} {topScorer.name} ({topPoints} pts)</span>}
          </div>
        </div>
      )}

      <TeamDashboard gameOverride={game} />
      <PlayerDashboard gameOverride={game} />
    </div>
  );
}
