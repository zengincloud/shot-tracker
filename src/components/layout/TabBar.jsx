import { useAppContext } from '../../context/AppContext';

export default function TabBar() {
  const { state, dispatch } = useAppContext();
  const { currentView } = state;

  const tabs = [
    { id: 'liveGame', label: 'Live Game' },
    { id: 'teamDash', label: 'Team Stats' },
    { id: 'playerDash', label: 'Player Stats' },
  ];

  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: tab.id })}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
