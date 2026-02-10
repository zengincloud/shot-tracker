import { useEffect } from 'react';
import { PLAYER_KEYS, SHOT_TYPE_KEYS, ZONE_KEYS } from '../constants/keymap';
import { getOrderedPlayers } from '../utils/playerOrder';
import * as db from '../utils/db';

export function useKeyboardShortcuts(state, dispatch) {
  const { inputStep, activeGame, trackingTeamId, pendingShot, teams } = state;

  useEffect(() => {
    if (!activeGame || state.currentView !== 'liveGame') return;

    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

      const key = e.key;

      // Utility: Undo
      if (key === 'Tab') {
        e.preventDefault();
        if (activeGame.shots.length > 0) {
          const lastShot = activeGame.shots[activeGame.shots.length - 1];
          db.deleteShot(lastShot.id).catch(console.error);
          dispatch({ type: 'UNDO_SHOT' });
        }
        return;
      }

      // Utility: Cancel
      if (key === 'Escape') {
        e.preventDefault();
        dispatch({ type: 'CANCEL_INPUT' });
        return;
      }

      // Utility: Toggle team (only at player step)
      if (key.toLowerCase() === 'q' && inputStep === 'player') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_TRACKING_TEAM' });
        return;
      }

      // Utility: Toggle instructions (only at player step)
      if (key.toLowerCase() === 'w' && inputStep === 'player') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_INSTRUCTIONS' });
        return;
      }

      // Step-specific
      switch (inputStep) {
        case 'player': {
          const idx = PLAYER_KEYS.indexOf(key);
          if (idx === -1) break;
          e.preventDefault();
          const team = teams.find(t => t.id === trackingTeamId);
          if (!team) break;
          const ordered = getOrderedPlayers(team.players);
          const player = ordered[idx];
          if (player) {
            dispatch({ type: 'SELECT_PLAYER', payload: player.id });
          }
          break;
        }

        case 'shotType': {
          const shotType = SHOT_TYPE_KEYS[key.toLowerCase()];
          if (!shotType) break;
          e.preventDefault();
          dispatch({ type: 'SELECT_SHOT_TYPE', payload: shotType });
          break;
        }

        case 'zone': {
          const zone = ZONE_KEYS[key.toLowerCase()];
          if (!zone) break;
          e.preventDefault();
          dispatch({ type: 'SELECT_ZONE', payload: zone });
          break;
        }

        case 'result': {
          if (key === ' ') {
            e.preventDefault();
            commitShot('made');
          } else if (key === 'Shift') {
            e.preventDefault();
            commitShot('missed');
          }
          break;
        }
      }
    }

    function commitShot(result) {
      const shot = {
        game_id: activeGame.id,
        player_id: pendingShot.playerId,
        team_id: trackingTeamId,
        shot_type: pendingShot.shotType,
        zone: pendingShot.zone,
        result,
        period: activeGame.current_period || 'Q1',
      };
      db.addShot(shot).then(saved => {
        dispatch({ type: 'COMMIT_SHOT', payload: saved });
      }).catch(console.error);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, inputStep, trackingTeamId, pendingShot, teams, dispatch, state.currentView]);
}
