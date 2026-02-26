import { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const COLORS = ['#C9A84C', '#059669', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#ec4899', '#14b8a6'];

export default function QuarterlyTrendChart({ quarterlyTrend }) {
  const { quarters, series } = quarterlyTrend || {};
  const [hidden, setHidden] = useState({});

  // Build a stable color map keyed by series id so toggling doesn't shift colors
  const colorMap = useMemo(() => {
    const map = {};
    (series || []).forEach((s, i) => { map[s.id] = COLORS[i % COLORS.length]; });
    return map;
  }, [series]);

  if (!quarters?.length || !series?.length) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--gray-500)' }}>Not enough data for trend chart</p>
      </div>
    );
  }

  const visibleSeries = series.filter((s) => !hidden[s.id]);

  const W = 800, H = 320, PAD = { top: 20, right: 20, bottom: 60, left: 50 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Fixed Y axis: whole numbers 1–5
  const yMin = 1;
  const yMax = 5;
  const yRange = yMax - yMin;
  const yTicks = [1, 2, 3, 4, 5];

  const xScale = (qi) => PAD.left + (qi / (quarters.length - 1)) * plotW;
  const yScale = (val) => PAD.top + plotH - ((val - yMin) / yRange) * plotH;

  const toggleSeries = (id) => setHidden((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 className="card-title">Quarterly Rating Trend</h3>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {yTicks.map((val) => {
          const y = yScale(val);
          return (
            <g key={val}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="var(--gray-200)" strokeWidth={0.5} />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="var(--gray-500)" fontSize={10}>{val}</text>
            </g>
          );
        })}

        {quarters.map((q, qi) => {
          // Show every Nth label to prevent x-axis flooding
          const step = quarters.length > 16 ? 4 : quarters.length > 8 ? 2 : 1;
          if (qi % step !== 0 && qi !== quarters.length - 1) return null;
          const x = xScale(qi);
          return (
            <text key={qi} x={x} y={H - PAD.bottom + 18} textAnchor="middle" fill="var(--gray-500)" fontSize={9}
              transform={`rotate(-45, ${x}, ${H - PAD.bottom + 18})`}
            >{q}</text>
          );
        })}

        {visibleSeries.map((s) => {
          const color = colorMap[s.id];
          const pts = s.points;
          if (pts.length < 2) return null;
          const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.qi)} ${yScale(Math.round(p.val))}`).join(' ');
          return (
            <path key={s.id} d={pathD} fill="none" stroke={color} strokeWidth={s.isMain ? 2.5 : 1.5} opacity={0.9} />
          );
        })}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {series.map((s) => {
          const color = colorMap[s.id];
          const isHidden = hidden[s.id];
          return (
            <button
              key={s.id}
              className="btn-secondary"
              onClick={() => toggleSeries(s.id)}
              style={{ opacity: isHidden ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 4, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
              {s.name} {s.isMain && '(You)'}
              {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
