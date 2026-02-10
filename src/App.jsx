import { useAuth } from './hooks/useAuth';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginScreen from './components/auth/LoginScreen';
import Header from './components/layout/Header';
import HomeScreen from './components/setup/HomeScreen';
import GameSetup from './components/setup/GameSetup';
import TeamManage from './components/setup/TeamManage';
import LiveGame from './components/game/LiveGame';
import TeamDashboard from './components/dashboard/TeamDashboard';
import PlayerDashboard from './components/dashboard/PlayerDashboard';
import GameHistory from './components/history/GameHistory';
import GameDetail from './components/history/GameDetail';
import './App.css';

function AppContent({ user, onSignOut }) {
  const { state } = useAppContext();
  const { currentView } = state;

  return (
    <div className="app">
      <Header user={user} onSignOut={onSignOut} />
      <main className="app-main">
        {currentView === 'home' && <HomeScreen />}
        {currentView === 'setup' && <GameSetup />}
        {currentView === 'teamManage' && <TeamManage />}
        {currentView === 'liveGame' && <LiveGame />}
        {currentView === 'teamDash' && <TeamDashboard />}
        {currentView === 'playerDash' && <PlayerDashboard />}
        {currentView === 'history' && <GameHistory />}
        {currentView === 'gameDetail' && <GameDetail />}
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner" />Loading...</div>;
  }

  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <AppProvider user={user}>
      <AppContent user={user} onSignOut={signOut} />
    </AppProvider>
  );
}
