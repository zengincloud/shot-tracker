import { useAppContext } from '../../context/AppContext';

export default function Header({ user, onSignOut }) {
  const { state, dispatch } = useAppContext();
  const { currentView, activeGame } = state;

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}>
          Shot Tracker
        </h1>
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
        >
          Home
        </button>
        <button
          className={`nav-btn ${currentView === 'teamManage' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'teamManage' })}
        >
          Teams
        </button>
        {activeGame && (
          <button
            className={`nav-btn ${currentView === 'liveGame' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'liveGame' })}
          >
            Live Game
          </button>
        )}
        <button
          className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'history' })}
        >
          History
        </button>
      </nav>
      <div className="header-right">
        <span className="user-name">{user?.username || 'User'}</span>
        <button className="btn btn-sm" onClick={onSignOut}>Sign Out</button>
      </div>
    </header>
  );
}
