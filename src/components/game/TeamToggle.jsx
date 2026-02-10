import { useAppContext } from '../../context/AppContext';

export default function TeamToggle() {
  const { state } = useAppContext();
  const { teams, trackingTeamId, activeGame } = state;

  if (!activeGame) return null;

  const trackingTeam = teams.find(t => t.id === trackingTeamId);
  const isTeam1 = trackingTeamId === activeGame.team1_id;

  return (
    <div className={`team-toggle ${isTeam1 ? 'team1' : 'team2'}`}>
      <span className="tracking-label">Tracking:</span>
      <span className="tracking-team-name">{trackingTeam?.name || '?'}</span>
      <span className="toggle-hint">[Q] switch</span>
    </div>
  );
}
