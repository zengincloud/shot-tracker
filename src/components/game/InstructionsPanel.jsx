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
          <p><kbd>A</kbd> 2pt &nbsp; <kbd>S</kbd> 3pt &nbsp; <kbd>D</kbd> FT</p>
        </div>
        <div className="instr-section">
          <h4>3. Zone</h4>
          <p><kbd>Z</kbd> L.Corner &nbsp; <kbd>X</kbd> L.Wing &nbsp; <kbd>Q</kbd> L.Slot &nbsp; <kbd>C</kbd> Top &nbsp; <kbd>W</kbd> R.Slot &nbsp; <kbd>V</kbd> R.Wing &nbsp; <kbd>B</kbd> R.Corner</p>
          <p><kbd>E</kbd> L.Short &nbsp; <kbd>R</kbd> R.Short &nbsp; <kbd>T</kbd> L.Paint &nbsp; <kbd>F</kbd> Top Paint &nbsp; <kbd>H</kbd> R.Paint &nbsp; <kbd>G</kbd> L.Elbow &nbsp; <kbd>J</kbd> R.Elbow</p>
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
