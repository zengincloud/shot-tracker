import { useAppContext } from '../../context/AppContext';

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const { activeGame } = state;

  return (
    <div className="home-screen">
      <div className="home-hero">
        <h2>Basketball Shot Tracker</h2>
        <p>Track shots with one hand. 4 keystrokes per play.</p>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Set up your teams &rarr; Start a game &rarr; Track shots live
        </p>
      </div>
      <div className="home-actions">
        {activeGame && (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'liveGame' })}
          >
            Resume Active Game
            <small className="btn-hint">Pick up where you left off</small>
          </button>
        )}
        <button
          className="btn btn-primary btn-lg"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'setup' })}
        >
          Start New Game
          <small className="btn-hint">Pick two teams and begin tracking</small>
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'teamManage' })}
        >
          Manage Teams
          <small className="btn-hint">Create rosters and add players</small>
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'history' })}
        >
          Game History
          <small className="btn-hint">Review past games and stats</small>
        </button>
      </div>
    </div>
  );
}
