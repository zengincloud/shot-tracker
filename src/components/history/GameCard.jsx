import { calculateTeamStats } from '../../utils/stats';
import { useAppContext } from '../../context/AppContext';
import * as db from '../../utils/db';

export default function GameCard({ game, teams, onClick }) {
  const { dispatch } = useAppContext();
  const team1 = teams.find(t => t.id === game.team1_id);
  const team2 = teams.find(t => t.id === game.team2_id);
  const shots = game.shots || [];

  const stats1 = calculateTeamStats(shots, game.team1_id);
  const stats2 = calculateTeamStats(shots, game.team2_id);

  function handleDelete(e) {
    e.stopPropagation();
    if (!confirm(`Delete ${team1?.name || '?'} vs ${team2?.name || '?'} (${game.date})? This cannot be undone.`)) return;
    db.deleteGame(game.id).catch(console.error);
    dispatch({ type: 'DELETE_GAME', payload: game.id });
  }

  return (
    <div className="game-card" onClick={onClick}>
      <button className="game-delete" onClick={handleDelete} title="Delete game">&times;</button>
      <div className="game-card-date">{game.date}</div>
      <div className="game-card-matchup">
        <span className={stats1.totalPoints > stats2.totalPoints ? 'winner' : ''}>
          {team1?.name || '?'} <strong>{stats1.totalPoints}</strong>
        </span>
        <span className="vs">vs</span>
        <span className={stats2.totalPoints > stats1.totalPoints ? 'winner' : ''}>
          <strong>{stats2.totalPoints}</strong> {team2?.name || '?'}
        </span>
      </div>
      <div className="game-card-meta">
        {shots.length} shots logged &middot; <span style={{ color: 'var(--accent)' }}>View Details &rarr;</span>
      </div>
    </div>
  );
}
