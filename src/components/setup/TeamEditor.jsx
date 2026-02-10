import { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { POSITIONS } from '../../constants/keymap';
import { getOrderedPlayers } from '../../utils/playerOrder';
import * as db from '../../utils/db';

export default function TeamEditor({ teamId, compact = false }) {
  const { state, dispatch } = useAppContext();
  const team = state.teams.find(t => t.id === teamId);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ number: '', name: '', position: 'PG', is_starter: false });
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (!team) return null;

  const ordered = getOrderedPlayers(team.players);

  function handleDragStart(e, index) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    e.currentTarget.classList.add('dragging-row');
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault();
    const fromIndex = dragIndex.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      dragIndex.current = null;
      setDragOverIndex(null);
      return;
    }
    const newOrder = [...ordered];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(dropIndex, 0, moved);

    const updatedPlayers = newOrder.map((p, i) => ({ ...p, sort_order: i }));
    dispatch({
      type: 'UPDATE_TEAM_PLAYERS',
      payload: { teamId, players: updatedPlayers },
    });

    for (const p of updatedPlayers) {
      db.updatePlayer(p.id, { sort_order: p.sort_order }).catch(console.error);
    }

    dragIndex.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging-row');
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.number) return;
    try {
      const maxOrder = team.players.reduce((max, p) => Math.max(max, p.sort_order ?? -1), -1);
      const player = await db.addPlayer(teamId, {
        number: parseInt(form.number, 10),
        name: form.name.trim(),
        position: form.position,
        is_starter: form.is_starter,
        sort_order: maxOrder + 1,
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

  function startEdit(player) {
    setEditingId(player.id);
    setForm({ number: String(player.number), name: player.name, position: player.position, is_starter: player.is_starter });
    setAdding(false);
  }

  async function handleSaveEdit() {
    if (!form.name.trim() || !form.number) return;
    try {
      const updated = await db.updatePlayer(editingId, {
        number: parseInt(form.number, 10),
        name: form.name.trim(),
        position: form.position,
        is_starter: form.is_starter,
      });
      dispatch({
        type: 'UPDATE_TEAM_PLAYERS',
        payload: { teamId, players: team.players.map(p => p.id === editingId ? updated : p) },
      });
      setEditingId(null);
      setForm({ number: '', name: '', position: 'PG', is_starter: false });
    } catch (err) {
      console.error('Failed to update player:', err);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ number: '', name: '', position: 'PG', is_starter: false });
  }

  async function handleDelete(playerId) {
    try {
      await db.deletePlayer(playerId);
      dispatch({
        type: 'UPDATE_TEAM_PLAYERS',
        payload: { teamId, players: team.players.filter(p => p.id !== playerId) },
      });
      if (editingId === playerId) cancelEdit();
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
        {!adding && !editingId && (
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

      {editingId && (
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
            onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
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
          <button className="btn btn-sm btn-primary" onClick={handleSaveEdit}>Save</button>
          <button className="btn btn-sm" onClick={cancelEdit}>Cancel</button>
        </div>
      )}

      {ordered.length === 0 ? (
        <p className="text-muted">No players added yet. Click "+ Add Player" to build your roster.</p>
      ) : (
        <table className="roster-table">
          <caption className="text-muted" style={{ captionSide: 'bottom', textAlign: 'left', padding: '0.5rem 0', fontSize: '0.75rem' }}>
            Slot = keyboard key used during live tracking. Drag rows to reorder.
          </caption>
          <thead>
            <tr>
              <th></th>
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
              <tr
                key={p.id}
                draggable={!editingId && !adding}
                onDragStart={e => handleDragStart(e, i)}
                onDragOver={e => handleDragOver(e, i)}
                onDrop={e => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                className={`${p.is_starter ? 'starter-row' : ''} ${editingId === p.id ? 'editing-row' : ''} ${dragOverIndex === i ? 'drag-over-row' : ''}`}
              >
                <td className="drag-handle">&#x2630;</td>
                <td className="slot-key">{['1','2','3','4','5','6','7','8','9','0'][i] || '-'}</td>
                <td className="jersey-num">{p.number}</td>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>
                  <button className="btn btn-xs" onClick={() => toggleStarter(p)}>
                    {p.is_starter ? 'Yes' : 'No'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn-xs" onClick={() => startEdit(p)}>edit</button>
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
