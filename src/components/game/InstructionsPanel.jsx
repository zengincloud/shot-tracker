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
          <p><kbd>Z</kbd> L.Corner &nbsp; <kbd>X</kbd> L.Wing &nbsp; <kbd>C</kbd> Top &nbsp; <kbd>V</kbd> R.Wing &nbsp; <kbd>B</kbd> R.Corner</p>
          <p><kbd>F</kbd> Paint &nbsp; <kbd>G</kbd> FT Line</p>
        </div>
        <div className="instr-section">
          <h4>4. Result</h4>
          <p><kbd>Space</kbd> Made &nbsp; <kbd>Shift</kbd> Missed</p>
        </div>
        <div className="instr-section">
          <h4>Utility</h4>
          <p><kbd>Q</kbd> Switch team &nbsp; <kbd>W</kbd> Hide this &nbsp; <kbd>Tab</kbd> Undo &nbsp; <kbd>Esc</kbd> Cancel</p>
        </div>
      </div>
    </div>
  );
}
