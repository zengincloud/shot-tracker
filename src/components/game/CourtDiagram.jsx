import { useAppContext } from '../../context/AppContext';
import { ZONES } from '../../constants/zones';

export default function CourtDiagram() {
  const { state } = useAppContext();
  const { inputStep, pendingShot } = state;
  const isZoneStep = inputStep === 'zone';

  return (
    <div className={`court-diagram ${isZoneStep ? 'active-step' : ''}`}>
      <h3 className="section-title">Court <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 400 }}>— press a zone key to select</span></h3>
      <svg viewBox="0 0 300 220" className="court-svg">
        {/* Court outline */}
        <rect x="5" y="5" width="290" height="210" rx="2" fill="none" stroke="var(--border)" strokeWidth="2" />

        {/* Paint */}
        <rect x="100" y="110" width="100" height="105" fill="none" stroke="var(--border)" strokeWidth="1.5" />

        {/* Free throw circle */}
        <circle cx="150" cy="110" r="30" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

        {/* 3-point arc */}
        <path
          d="M 30 215 L 30 85 Q 150 -15 270 85 L 270 215"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* Basket */}
        <circle cx="150" cy="205" r="5" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* Zone hotspots */}
        {ZONES.map(zone => {
          const cx = (zone.x / 100) * 290 + 5;
          const cy = (zone.y / 100) * 210 + 5;
          const isSelected = pendingShot.zone === zone.id;
          const isActive = isZoneStep;

          return (
            <g key={zone.id}>
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 15 : 12}
                fill={isSelected ? 'var(--accent)' : isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'}
                stroke={isActive ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.6}
                className={isActive ? 'zone-pulse' : ''}
              />
              <text
                x={cx}
                y={cy - 3}
                textAnchor="middle"
                fill={isSelected ? '#fff' : isActive ? 'var(--accent)' : 'var(--text-muted)'}
                fontSize="9"
                fontWeight="bold"
              >
                {zone.key}
              </text>
              <text
                x={cx}
                y={cy + 7}
                textAnchor="middle"
                fill={isSelected ? '#fff' : 'var(--text-secondary)'}
                fontSize="5.5"
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
