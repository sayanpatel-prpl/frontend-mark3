import { useState } from 'react';

const SOURCE_COLORS = {
  g2: '#FF492C',
  gartner: '#002856',
  trustpilot: '#00B67A',
  capterra: '#FF8C00',
  unknown: '#9CA3AF',
};

const SOURCE_LABELS = {
  g2: 'G2',
  gartner: 'Gartner',
  trustpilot: 'Trustpilot',
  capterra: 'Capterra',
  unknown: 'Other',
};

export default function ReviewSourcePieChart({ reviewSourceBreakdown }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!reviewSourceBreakdown || Object.keys(reviewSourceBreakdown).length === 0) return null;

  const entries = Object.entries(reviewSourceBreakdown)
    .map(([source, count]) => ({
      source,
      label: SOURCE_LABELS[source] || source.charAt(0).toUpperCase() + source.slice(1),
      count,
      color: SOURCE_COLORS[source] || '#6B7280',
    }))
    .sort((a, b) => b.count - a.count);

  const total = entries.reduce((sum, e) => sum + e.count, 0);

  // SVG pie chart
  const R = 80;
  const CX = 100;
  const CY = 100;
  let cumAngle = -Math.PI / 2; // start at top

  const slices = entries.map((entry) => {
    const fraction = entry.count / total;
    const startAngle = cumAngle;
    const endAngle = cumAngle + fraction * 2 * Math.PI;
    cumAngle = endAngle;

    const largeArc = fraction > 0.5 ? 1 : 0;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);

    const d = fraction >= 1
      ? `M ${CX - R} ${CY} A ${R} ${R} 0 1 1 ${CX + R} ${CY} A ${R} ${R} 0 1 1 ${CX - R} ${CY}`
      : `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...entry, d, fraction };
  });

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 className="card-title">Review Source Distribution</h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
        Percentage share of reviews by platform across all companies in this report
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <svg viewBox="0 0 200 200" style={{ width: 180, height: 180, flexShrink: 0 }}>
          {slices.map((slice, i) => (
            <path
              key={slice.source}
              d={slice.d}
              fill={slice.color}
              stroke="var(--white)"
              strokeWidth={2}
              opacity={hoveredSlice === null || hoveredSlice === i ? 1 : 0.4}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
              onMouseEnter={() => setHoveredSlice(i)}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          ))}
          {/* Center text */}
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--navy)">
            {total.toLocaleString()}
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill="var(--gray-500)">
            Total Reviews
          </text>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 160 }}>
          {slices.map((slice, i) => (
            <div
              key={slice.source}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 10px',
                borderRadius: 6,
                background: hoveredSlice === i ? 'var(--gray-50)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setHoveredSlice(i)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <span style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: slice.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gray-700)', flex: 1 }}>
                {slice.label}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)' }}>
                {Math.round(slice.fraction * 100)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                ({slice.count.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
