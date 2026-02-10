import { useAppContext } from '../../context/AppContext';
import { PLAYER_KEYS } from '../../constants/keymap';

export default function PlayerSelector() {
  const { state } = useAppContext();
  const { teams, trackingTeamId, pendingShot, inputStep } = state;

  const team = teams.find(t => t.id === trackingTeamId);
  if (!team) return null;

  const starters = team.players.filter(p => p.is_starter).sort((a, b) => a.number - b.number);
  const bench = team.players.filter(p => !p.is_starter).sort((a, b) => a.number - b.number);
  const ordered = [...starters, ...bench];

  return (
    <div className={`player-selector ${inputStep === 'player' ? 'active-step' : ''}`}>
      <h3 className="section-title">Players <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 400 }}>— press 1-0 to select</span></h3>
      <div className="player-grid">
        {ordered.map((p, i) => {
          if (i >= 10) return null;
          const key = PLAYER_KEYS[i];
          const isActive = pendingShot.playerId === p.id;
          return (
            <div key={p.id} className={`player-slot ${isActive ? 'selected' : ''} ${p.is_starter ? 'starter' : 'bench'}`}>
              <span className="slot-key-badge">{key}</span>
              <span className="player-number">#{p.number}</span>
              <span className="player-name">{p.name}</span>
              <span className="player-pos">{p.position}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
