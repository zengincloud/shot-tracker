import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import TeamSelector from './TeamSelector';
import TeamEditor from './TeamEditor';
import * as db from '../../utils/db';

export default function TeamManage() {
  const { state, dispatch } = useAppContext();
  const [selectedId, setSelectedId] = useState(null);

  async function handleDeleteTeam() {
    if (!selectedId) return;
    const team = state.teams.find(t => t.id === selectedId);
    if (!window.confirm(`Delete ${team?.name}? This cannot be undone.`)) return;
    try {
      await db.deleteTeam(selectedId);
      dispatch({ type: 'DELETE_TEAM', payload: selectedId });
      setSelectedId(null);
    } catch (err) {
      console.error('Failed to delete team:', err);
    }
  }

  return (
    <div className="team-manage">
      <h2>Manage Teams</h2>
      <p className="section-desc">Create and manage your team rosters. Add players with jersey numbers and positions before starting a game.</p>
      <TeamSelector label="Select Team" selectedId={selectedId} onSelect={setSelectedId} />
      {selectedId && (
        <>
          <TeamEditor teamId={selectedId} />
          <button className="btn btn-danger btn-sm delete-team-btn" onClick={handleDeleteTeam}>
            Delete Team
          </button>
        </>
      )}
    </div>
  );
}
