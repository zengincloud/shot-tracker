import { useAppContext } from '../../context/AppContext';
import TeamDashboard from '../dashboard/TeamDashboard';
import PlayerDashboard from '../dashboard/PlayerDashboard';

export default function GameDetail() {
  const { state, dispatch } = useAppContext();
  const game = state.games.find(g => g.id === state.selectedGameId);

  if (!game) return <p className="text-muted">Game not found</p>;

  const team1 = state.teams.find(t => t.id === game.team1_id);
  const team2 = state.teams.find(t => t.id === game.team2_id);

  return (
    <div className="game-detail">
      <button className="btn btn-sm" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'history' })}>
        &larr; Back to History
      </button>
      <h2>{team1?.name} vs {team2?.name} — {game.date}</h2>
      <TeamDashboard gameOverride={game} />
      <PlayerDashboard gameOverride={game} />
    </div>
  );
}
