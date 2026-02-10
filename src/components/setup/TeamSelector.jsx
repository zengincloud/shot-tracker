import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import * as db from '../../utils/db';

export default function TeamSelector({ label, selectedId, onSelect }) {
  const { state, dispatch } = useAppContext();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  async function handleCreate() {
    if (!newName.trim()) return;
    try {
      const team = await db.createTeam(newName.trim());
      dispatch({ type: 'ADD_TEAM', payload: team });
      onSelect(team.id);
      setCreating(false);
      setNewName('');
    } catch (err) {
      console.error('Failed to create team:', err);
    }
  }

  return (
    <div className="team-selector">
      <label className="label">{label}</label>
      {!creating ? (
        <div className="team-selector-row">
          <select
            className="select"
            value={selectedId || ''}
            onChange={e => onSelect(e.target.value || null)}
          >
            <option value="">Select a team...</option>
            {state.teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button className="btn btn-sm" onClick={() => setCreating(true)}>+ New</button>
        </div>
      ) : (
        <div className="team-selector-row">
          <input
            className="input"
            placeholder="Team name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <button className="btn btn-sm btn-primary" onClick={handleCreate}>Save</button>
          <button className="btn btn-sm" onClick={() => { setCreating(false); setNewName(''); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
