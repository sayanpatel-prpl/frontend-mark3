/**
 * Multi-line SVG chart for preview pages.
 * @param {{ lines: Array<{ label: string, color: string, data: number[] }>, labels?: string[] }} props
 */
export default function DummyLineChart({ lines, labels = [] }) {
  const width = 500;
  const height = 200;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const allValues = lines.flatMap(l => l.data);
  const minVal = Math.min(...allValues) * 0.9;
  const maxVal = Math.max(...allValues) * 1.1;
  const range = maxVal - minVal || 1;

  const toX = (i, total) => padX + (i / (total - 1)) * chartW;
  const toY = (v) => padY + chartH - ((v - minVal) / range) * chartH;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="dummy-line-chart">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = padY + chartH * (1 - f);
          const val = Math.round(minVal + range * f);
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="var(--gray-200, #E8E8EF)" strokeWidth={1} />
              <text x={padX - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--gray-400, #B4B4C7)">{val}</text>
            </g>
          );
        })}

        {/* X labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={toX(i, labels.length)}
            y={height - 2}
            textAnchor="middle"
            fontSize={9}
            fill="var(--gray-400, #B4B4C7)"
          >
            {label}
          </text>
        ))}

        {/* Lines */}
        {lines.map((line, li) => {
          const points = line.data.map((v, i) => `${toX(i, line.data.length)},${toY(v)}`).join(' ');
          return (
            <polyline
              key={li}
              points={points}
              fill="none"
              stroke={line.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Dots */}
        {lines.map((line, li) =>
          line.data.map((v, i) => (
            <circle
              key={`${li}-${i}`}
              cx={toX(i, line.data.length)}
              cy={toY(v)}
              r={3}
              fill={line.color}
            />
          ))
        )}
      </svg>

      <div className="dummy-line-chart-legend">
        {lines.map((line, i) => (
          <div className="dummy-line-chart-legend-item" key={i}>
            <div className="dummy-line-chart-legend-dot" style={{ background: line.color }} />
            {line.label}
          </div>
        ))}
      </div>
    </div>
  );
}
