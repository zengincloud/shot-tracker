import { useAppContext } from '../../context/AppContext';
import { ZONE_KEYS } from '../../constants/keymap';
import * as db from '../../utils/db';

export default function ShotLog() {
  const { state, dispatch } = useAppContext();
  const { activeGame, teams } = state;

  if (!activeGame) return null;

  const shots = [...activeGame.shots].reverse().slice(0, 50);

  function getPlayerInfo(playerId) {
    for (const team of teams) {
      const p = team.players.find(pl => pl.id === playerId);
      if (p) return p;
    }
    return null;
  }

  function getTeamName(teamId) {
    return teams.find(t => t.id === teamId)?.name || '?';
  }

  function getZoneLabel(zoneId) {
    const z = Object.values(ZONE_KEYS).find(z => z.id === zoneId);
    return z?.label || zoneId;
  }

  function shotTypeLabel(type) {
    if (type === '2pt') return '2PT';
    if (type === '3pt') return '3PT';
    if (type === 'ft') return 'FT';
    return type;
  }

  return (
    <div className="shot-log">
      <h3 className="section-title">Shot Log ({activeGame.shots.length})</h3>
      {shots.length === 0 ? (
        <p className="text-muted">No shots logged yet. Shots will appear here as you log them.</p>
      ) : (
        <div className="shot-log-list">
          {shots.map((shot, i) => {
            const player = getPlayerInfo(shot.player_id);
            return (
              <div key={shot.id || i} className={`shot-entry ${shot.result}`}>
                <span className="shot-result-badge">{shot.result === 'made' ? '✓' : '✗'}</span>
                <span className="shot-player">#{player?.number} {player?.name?.split(' ')[0]}</span>
                <span className="shot-type-badge">{shotTypeLabel(shot.shot_type)}</span>
                <span className="shot-zone">{getZoneLabel(shot.zone)}</span>
                <span className="shot-team-badge">{getTeamName(shot.team_id).slice(0, 3).toUpperCase()}</span>
                {shot.period && <span className="shot-period">{shot.period}</span>}
                <button
                  className="btn btn-xs shot-delete"
                  onClick={() => {
                    db.deleteShot(shot.id).catch(console.error);
                    dispatch({ type: 'DELETE_SHOT', payload: shot.id });
                  }}
                >✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
