import { useAppContext } from '../../context/AppContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import TabBar from '../layout/TabBar';
import InstructionsPanel from './InstructionsPanel';
import TeamToggle from './TeamToggle';
import PeriodControl from './PeriodControl';
import InputFlow from './InputFlow';
import PlayerSelector from './PlayerSelector';
import CourtDiagram from './CourtDiagram';
import ShotLog from './ShotLog';
import Toast from './Toast';
import * as db from '../../utils/db';

export default function LiveGame() {
  const { state, dispatch } = useAppContext();
  const { activeGame } = state;

  useKeyboardShortcuts(state, dispatch);

  if (!activeGame) return null;

  async function handleEndGame() {
    if (!window.confirm('End this game?')) return;
    await db.updateGame(activeGame.id, { status: 'completed', completed_at: new Date().toISOString() });
    dispatch({ type: 'END_GAME' });
  }

  return (
    <div className="live-game">
      <TabBar />
      <p className="section-desc" style={{ marginBottom: '0.5rem' }}>
        Log shots in 4 keystrokes: Player &rarr; Shot Type &rarr; Zone &rarr; Result. Press <kbd>W</kbd> to toggle the full shortcut reference.
      </p>
      <InstructionsPanel />

      <div className="live-game-header">
        <TeamToggle />
        <PeriodControl />
        <button className="btn btn-sm btn-danger end-game-btn" onClick={handleEndGame}>
          End Game
        </button>
      </div>

      <InputFlow />

      <div className="live-game-body">
        <div className="live-game-left">
          <PlayerSelector />
        </div>
        <div className="live-game-center">
          <CourtDiagram />
        </div>
        <div className="live-game-right">
          <ShotLog />
        </div>
      </div>

      <Toast />
    </div>
  );
}
