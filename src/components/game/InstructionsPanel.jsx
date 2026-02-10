import { useAppContext } from '../../context/AppContext';

export default function InstructionsPanel() {
  const { state } = useAppContext();
  if (!state.showInstructions) return null;

  return (
    <div className="instructions-panel">
      <div className="instructions-grid">
        <div className="instr-section">
          <h4>1. Player</h4>
          <p><kbd>1</kbd>-<kbd>5</kbd> Starters &nbsp; <kbd>6</kbd>-<kbd>0</kbd> Bench</p>
        </div>
        <div className="instr-section">
          <h4>2. Shot Type</h4>
          <p><kbd>1</kbd> FT &nbsp; <kbd>2</kbd> 2pt &nbsp; <kbd>3</kbd> 3pt</p>
        </div>
        <div className="instr-section">
          <h4>3. Zone</h4>
          <p>3PT: <kbd>Q</kbd> R.Corner &nbsp; <kbd>W</kbd> R.Wing &nbsp; <kbd>E</kbd> R.Slot &nbsp; <kbd>R</kbd> Top &nbsp; <kbd>T</kbd> L.Slot &nbsp; <kbd>Y</kbd> L.Wing &nbsp; <kbd>U</kbd> L.Corner</p>
          <p>Mid: <kbd>A</kbd> R.Short &nbsp; <kbd>S</kbd> R.Elbow &nbsp; <kbd>D</kbd> L.Elbow &nbsp; <kbd>F</kbd> L.Short</p>
          <p>Paint: <kbd>Z</kbd> R.Paint &nbsp; <kbd>X</kbd> Top Paint &nbsp; <kbd>C</kbd> L.Paint</p>
        </div>
        <div className="instr-section">
          <h4>4. Result</h4>
          <p><kbd>Space</kbd> Made &nbsp; <kbd>Shift</kbd> Missed</p>
        </div>
        <div className="instr-section">
          <h4>Utility</h4>
          <p><kbd>Q</kbd> Switch team (step 1) &nbsp; <kbd>W</kbd> Hide this (step 1) &nbsp; <kbd>Tab</kbd> Undo &nbsp; <kbd>Esc</kbd> Cancel</p>
        </div>
      </div>
    </div>
  );
}
