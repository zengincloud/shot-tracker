import { useAppContext } from '../../context/AppContext';
import { PERIOD_OPTIONS } from '../../constants/keymap';
import * as db from '../../utils/db';

export default function PeriodControl() {
  const { state, dispatch } = useAppContext();
  const { activeGame } = state;

  if (!activeGame) return null;

  const format = PERIOD_OPTIONS.find(p => p.id === activeGame.period_format);
  const periods = format?.periods || ['Q1', 'Q2', 'Q3', 'Q4'];
  const allPeriods = [...periods, 'OT'];

  async function setPeriod(period) {
    dispatch({ type: 'ADVANCE_PERIOD', payload: period });
    await db.updateGame(activeGame.id, { current_period: period }).catch(console.error);
  }

  return (
    <div className="period-control">
      {allPeriods.map(p => (
        <button
          key={p}
          className={`btn btn-xs ${activeGame.current_period === p ? 'btn-primary' : ''}`}
          onClick={() => setPeriod(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
