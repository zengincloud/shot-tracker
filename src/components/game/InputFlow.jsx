import { useAppContext } from '../../context/AppContext';
import { SHOT_TYPE_KEYS, ZONE_KEYS } from '../../constants/keymap';

const STEPS = [
  { id: 'player', label: 'Player', num: '1' },
  { id: 'shotType', label: 'Shot Type', num: '2' },
  { id: 'zone', label: 'Zone', num: '3' },
  { id: 'result', label: 'Result', num: '4' },
];

export default function InputFlow() {
  const { state } = useAppContext();
  const { inputStep, pendingShot, teams, trackingTeamId } = state;

  const team = teams.find(t => t.id === trackingTeamId);
  const player = team?.players.find(p => p.id === pendingShot.playerId);

  function getStepValue(stepId) {
    switch (stepId) {
      case 'player':
        return player ? `#${player.number} ${player.name}` : '—';
      case 'shotType': {
        if (!pendingShot.shotType) return '—';
        const st = Object.values(SHOT_TYPE_KEYS).find(s => s.id === pendingShot.shotType);
        return st?.label || '—';
      }
      case 'zone': {
        if (!pendingShot.zone) return '—';
        const z = Object.values(ZONE_KEYS).find(z => z.id === pendingShot.zone);
        return z?.label || '—';
      }
      case 'result':
        return '—';
      default:
        return '—';
    }
  }

  function getStepStatus(stepId) {
    const stepOrder = STEPS.map(s => s.id);
    const currentIdx = stepOrder.indexOf(inputStep);
    const thisIdx = stepOrder.indexOf(stepId);
    if (thisIdx < currentIdx) return 'completed';
    if (thisIdx === currentIdx) return 'active';
    return 'upcoming';
  }

  function getHint() {
    switch (inputStep) {
      case 'player': return 'Press 1-0 for a player';
      case 'shotType': return 'A = 2pt  |  S = 3pt  |  D = FT';
      case 'zone': return 'Z X C V B = court zones  |  F = paint  |  G = FT line';
      case 'result': return 'Space = Made  |  Shift = Missed';
      default: return '';
    }
  }

  return (
    <div className="input-flow">
      <div className="input-steps">
        {STEPS.map((step, i) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className={`input-step ${status}`}>
              <div className="step-num">{step.num}</div>
              <div className="step-info">
                <div className="step-label">{step.label}</div>
                <div className="step-value">{getStepValue(step.id)}</div>
              </div>
              {i < STEPS.length - 1 && <div className="step-arrow">&rarr;</div>}
            </div>
          );
        })}
      </div>
      <div className="input-hint">{getHint()}</div>
    </div>
  );
}
