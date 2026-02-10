import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { POSITIONS } from '../../constants/keymap';
import * as db from '../../utils/db';

export default function TeamEditor({ teamId, compact = false }) {
  const { state, dispatch } = useAppContext();
  const team = state.teams.find(t => t.id === teamId);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ number: '', name: '', position: 'PG', is_starter: false });

  if (!team) return null;

  const starters = team.players.filter(p => p.is_starter).sort((a, b) => a.number - b.number);
  const bench = team.players.filter(p => !p.is_starter).sort((a, b) => a.number - b.number);
  const ordered = [...starters, ...bench];

  async function handleAdd() {
    if (!form.name.trim() || !form.number) return;
    try {
      const player = await db.addPlayer(teamId, {
        number: parseInt(form.number, 10),
        name: form.name.trim(),
        position: form.position,
        is_starter: form.is_starter,
      });
      dispatch({
        type: 'UPDATE_TEAM_PLAYERS',
        payload: { teamId, players: [...team.players, player] },
      });
      setForm({ number: '', name: '', position: 'PG', is_starter: false });
      setAdding(false);
    } catch (err) {
      console.error('Failed to add player:', err);
    }
  }

  async function handleDelete(playerId) {
    try {
      await db.deletePlayer(playerId);
      dispatch({
        type: 'UPDATE_TEAM_PLAYERS',
        payload: { teamId, players: team.players.filter(p => p.id !== playerId) },
      });
    } catch (err) {
      console.error('Failed to delete player:', err);
    }
  }

  async function toggleStarter(player) {
    try {
      const updated = await db.updatePlayer(player.id, { is_starter: !player.is_starter });
      dispatch({
        type: 'UPDATE_TEAM_PLAYERS',
        payload: { teamId, players: team.players.map(p => p.id === player.id ? updated : p) },
      });
    } catch (err) {
      console.error('Failed to update player:', err);
    }
  }

  return (
    <div className={`team-editor ${compact ? 'compact' : ''}`}>
      <div className="team-editor-header">
        <h3>{team.name} Roster ({team.players.length} players)</h3>
        {!adding && (
          <button className="btn btn-sm btn-primary" onClick={() => setAdding(true)}>+ Add Player</button>
        )}
      </div>

      {adding && (
        <div className="player-add-form">
          <input
            className="input input-sm"
            type="number"
            placeholder="#"
            value={form.number}
            onChange={e => setForm({ ...form, number: e.target.value })}
            style={{ width: '60px' }}
          />
          <input
            className="input input-sm"
            placeholder="Player name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <select
            className="select select-sm"
            value={form.position}
            onChange={e => setForm({ ...form, position: e.target.value })}
          >
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.is_starter}
              onChange={e => setForm({ ...form, is_starter: e.target.checked })}
            />
            Starter
          </label>
          <button className="btn btn-sm btn-primary" onClick={handleAdd}>Save</button>
          <button className="btn btn-sm" onClick={() => setAdding(false)}>Cancel</button>
        </div>
      )}

      {ordered.length === 0 ? (
        <p className="text-muted">No players added yet. Click "+ Add Player" to build your roster.</p>
      ) : (
        <table className="roster-table">
          <caption className="text-muted" style={{ captionSide: 'bottom', textAlign: 'left', padding: '0.5rem 0', fontSize: '0.75rem' }}>
            Slot = keyboard key used during live tracking. Starters get keys 1-5, bench gets 6-0.
          </caption>
          <thead>
            <tr>
              <th>Slot</th>
              <th>#</th>
              <th>Name</th>
              <th>Pos</th>
              <th>Starter</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((p, i) => (
              <tr key={p.id} className={p.is_starter ? 'starter-row' : ''}>
                <td className="slot-key">{['1','2','3','4','5','6','7','8','9','0'][i] || '-'}</td>
                <td className="jersey-num">{p.number}</td>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>
                  <button className="btn btn-xs" onClick={() => toggleStarter(p)}>
                    {p.is_starter ? 'Yes' : 'No'}
                  </button>
                </td>
                <td>
                  <button className="btn btn-xs btn-danger" onClick={() => handleDelete(p.id)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
