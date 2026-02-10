import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERIOD_OPTIONS } from '../../constants/keymap';
import TeamSelector from './TeamSelector';
import TeamEditor from './TeamEditor';
import * as db from '../../utils/db';

export default function GameSetup() {
  const { state, dispatch } = useAppContext();
  const [team1Id, setTeam1Id] = useState(null);
  const [team2Id, setTeam2Id] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodFormat, setPeriodFormat] = useState('4q');
  const [error, setError] = useState('');

  const team1 = state.teams.find(t => t.id === team1Id);
  const team2 = state.teams.find(t => t.id === team2Id);

  async function handleStart() {
    setError('');
    if (!team1Id || !team2Id) { setError('Select both teams'); return; }
    if (team1Id === team2Id) { setError('Teams must be different'); return; }
    if (!team1?.players?.length) { setError(`${team1.name} has no players`); return; }
    if (!team2?.players?.length) { setError(`${team2.name} has no players`); return; }

    try {
      const game = await db.createGame(team1Id, team2Id, date, periodFormat);
      dispatch({ type: 'START_GAME', payload: game });
    } catch (err) {
      setError('Failed to create game: ' + err.message);
    }
  }

  return (
    <div className="game-setup">
      <h2>New Game</h2>
      <p className="section-desc">Select two teams and configure the game format. Both teams need at least one player on their roster.</p>

      <div className="setup-row">
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="setup-row">
        <label className="label">Period Format <span className="text-muted" style={{ fontWeight: 400 }}>— choose how the game is divided</span></label>
        <div className="period-options">
          {PERIOD_OPTIONS.filter(p => p.id !== 'ot').map(p => (
            <button
              key={p.id}
              className={`btn btn-sm ${periodFormat === p.id ? 'btn-primary' : ''}`}
              onClick={() => setPeriodFormat(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-teams">
        <div className="setup-team">
          <TeamSelector label="Your Team" selectedId={team1Id} onSelect={setTeam1Id} />
          {team1Id && <TeamEditor teamId={team1Id} compact />}
        </div>
        <div className="setup-divider">VS</div>
        <div className="setup-team">
          <TeamSelector label="Opponent" selectedId={team2Id} onSelect={setTeam2Id} />
          {team2Id && <TeamEditor teamId={team2Id} compact />}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button className="btn btn-primary btn-lg start-btn" onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
}
