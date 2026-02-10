export default function StatTable({ stats, label }) {
  if (!stats) return null;

  const rows = [
    { label: '2-Point', ...stats.twoPoint },
    { label: '3-Point', ...stats.threePoint },
    { label: 'Free Throw', ...stats.freeThrow },
    { label: 'Field Goal', ...stats.fieldGoal },
  ];

  return (
    <div className="stat-table-wrap">
      {label && <h4 className="stat-table-label">{label}</h4>}
      <table className="stat-table">
        <thead>
          <tr>
            <th></th>
            <th>Made</th>
            <th>Att</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label}>
              <td className="stat-category">{r.label}</td>
              <td className="stat-made">{r.made}</td>
              <td>{r.attempted}</td>
              <td className="stat-pct">{r.pct}%</td>
            </tr>
          ))}
          <tr className="stat-total-row">
            <td>Total Points</td>
            <td colSpan="3" className="stat-total">{stats.totalPoints}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
