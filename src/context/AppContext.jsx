import { createContext, useContext, useReducer, useEffect } from 'react';
import * as db from '../utils/db';

const AppContext = createContext();

const initialState = {
  teams: [],
  games: [],
  activeGame: null,
  trackingTeamId: null,
  inputStep: 'player',
  pendingShot: { playerId: null, shotType: null, zone: null },
  currentView: 'home',
  showInstructions: true,
  selectedGameId: null,
  teamsLoaded: false,
  gamesLoaded: false,
  toast: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TEAMS':
      return { ...state, teams: action.payload, teamsLoaded: true };

    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };

    case 'UPDATE_TEAM': {
      const teams = state.teams.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
      return { ...state, teams };
    }

    case 'DELETE_TEAM': {
      const teams = state.teams.filter(t => t.id !== action.payload);
      return { ...state, teams };
    }

    case 'UPDATE_TEAM_PLAYERS': {
      const teams = state.teams.map(t =>
        t.id === action.payload.teamId ? { ...t, players: action.payload.players } : t
      );
      return { ...state, teams };
    }

    case 'SET_GAMES':
      return { ...state, games: action.payload, gamesLoaded: true };

    case 'START_GAME': {
      const game = action.payload;
      return {
        ...state,
        activeGame: game,
        trackingTeamId: game.team1_id,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
        currentView: 'liveGame',
        games: [...state.games, game],
      };
    }

    case 'END_GAME': {
      if (!state.activeGame) return state;
      const updated = { ...state.activeGame, status: 'completed', completed_at: new Date().toISOString() };
      const games = state.games.map(g => g.id === updated.id ? updated : g);
      return {
        ...state,
        activeGame: null,
        trackingTeamId: null,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
        games,
        currentView: 'gameDetail',
        selectedGameId: updated.id,
      };
    }

    case 'TOGGLE_TRACKING_TEAM': {
      if (!state.activeGame) return state;
      const next = state.trackingTeamId === state.activeGame.team1_id
        ? state.activeGame.team2_id
        : state.activeGame.team1_id;
      return {
        ...state,
        trackingTeamId: next,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
      };
    }

    case 'ADVANCE_PERIOD': {
      if (!state.activeGame) return state;
      return {
        ...state,
        activeGame: { ...state.activeGame, current_period: action.payload },
      };
    }

    case 'SELECT_PLAYER':
      return {
        ...state,
        inputStep: 'shotType',
        pendingShot: { ...state.pendingShot, playerId: action.payload },
      };

    case 'SELECT_SHOT_TYPE': {
      if (action.payload.id === 'ft') {
        return {
          ...state,
          inputStep: 'result',
          pendingShot: { ...state.pendingShot, shotType: action.payload.id, zone: 'ft-line' },
        };
      }
      return {
        ...state,
        inputStep: 'zone',
        pendingShot: { ...state.pendingShot, shotType: action.payload.id },
      };
    }

    case 'SELECT_ZONE':
      return {
        ...state,
        inputStep: 'result',
        pendingShot: { ...state.pendingShot, zone: action.payload.id },
      };

    case 'COMMIT_SHOT': {
      if (!state.activeGame) return state;
      const shot = action.payload;
      const activeGame = {
        ...state.activeGame,
        shots: [...state.activeGame.shots, shot],
      };
      const games = state.games.map(g => g.id === activeGame.id ? activeGame : g);
      return {
        ...state,
        activeGame,
        games,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
        toast: {
          type: shot.result,
          message: `${shot.result === 'made' ? '✓' : '✗'} ${shot.shot_type} — ${shot.zone}`,
          timestamp: Date.now(),
        },
      };
    }

    case 'UNDO_SHOT': {
      if (!state.activeGame || state.activeGame.shots.length === 0) return state;
      const shots = [...state.activeGame.shots];
      const removed = shots.pop();
      const activeGame = { ...state.activeGame, shots };
      const games = state.games.map(g => g.id === activeGame.id ? activeGame : g);
      return {
        ...state,
        activeGame,
        games,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
        toast: { type: 'undo', message: `Undone: ${removed.shot_type} ${removed.zone}`, timestamp: Date.now() },
      };
    }

    case 'CANCEL_INPUT':
      return {
        ...state,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
      };

    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_SELECTED_GAME':
      return { ...state, selectedGameId: action.payload, currentView: 'gameDetail' };

    case 'TOGGLE_INSTRUCTIONS':
      return { ...state, showInstructions: !state.showInstructions };

    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    case 'RESUME_GAME': {
      const game = action.payload;
      return {
        ...state,
        activeGame: game,
        trackingTeamId: game.team1_id,
        inputStep: 'player',
        pendingShot: { playerId: null, shotType: null, zone: null },
        currentView: 'liveGame',
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children, user }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (!user) return;
    db.fetchTeams().then(teams => dispatch({ type: 'SET_TEAMS', payload: teams }))
      .catch(err => console.error('Failed to load teams:', err));
    db.fetchGames().then(games => {
      dispatch({ type: 'SET_GAMES', payload: games });
      const active = games.find(g => g.status === 'active');
      if (active) dispatch({ type: 'RESUME_GAME', payload: active });
    }).catch(err => console.error('Failed to load games:', err));
  }, [user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
