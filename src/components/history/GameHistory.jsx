import { useAppContext } from '../../context/AppContext';
import GameCard from './GameCard';

export default function GameHistory() {
  const { state, dispatch } = useAppContext();
  const completedGames = state.games
    .filter(g => g.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="game-history">
      <h2>Game History</h2>
      <p className="section-desc">View your completed games. Click any game to see detailed shooting stats and player breakdowns.</p>
      {completedGames.length === 0 ? (
        <p className="text-muted">No completed games yet. Finished games will appear here after you end them.</p>
      ) : (
        <div className="game-list">
          {completedGames.map(g => (
            <GameCard
              key={g.id}
              game={g}
              teams={state.teams}
              onClick={() => dispatch({ type: 'SET_SELECTED_GAME', payload: g.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
