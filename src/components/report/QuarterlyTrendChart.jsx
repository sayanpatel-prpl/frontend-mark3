import { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const COLORS = ['#C9A84C', '#059669', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#ec4899', '#14b8a6'];

const PERIOD_OPTIONS = [
  { key: '30d', label: '30 Days', days: 30 },
  { key: '90d', label: '90 Days', days: 90 },
  { key: '180d', label: '180 Days', days: 180 },
  { key: '360d', label: '360 Days', days: 360 },
];

function parseQuarterDate(q) {
  // "Q1 2024" -> start of that quarter
  const match = q.match(/Q(\d)\s+(\d{4})/);
  if (!match) return null;
  const quarter = parseInt(match[1]);
  const year = parseInt(match[2]);
  const month = (quarter - 1) * 3; // 0-indexed
  return new Date(year, month, 1);
}

function quarterEndDate(q) {
  const match = q.match(/Q(\d)\s+(\d{4})/);
  if (!match) return null;
  const quarter = parseInt(match[1]);
  const year = parseInt(match[2]);
  const month = quarter * 3; // end month (exclusive)
  return new Date(year, month, 0); // last day of the quarter
}

function ReviewVolumeChart({ quarterlyTrend }) {
  const { quarters, series } = quarterlyTrend || {};
  const [period, setPeriod] = useState('360d');

  const selectedDays = PERIOD_OPTIONS.find(p => p.key === period)?.days || 360;

  const { filteredQuarters, companyTotals } = useMemo(() => {
    if (!quarters?.length || !series?.length) return { filteredQuarters: [], companyTotals: [] };

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selectedDays);

    // Find which quarters fall within the period
    const filtered = quarters.filter((q) => {
      const end = quarterEndDate(q);
      return end && end >= cutoff;
    });

    if (!filtered.length) return { filteredQuarters: [], companyTotals: [] };

    const filteredIndices = new Set(filtered.map(q => quarters.indexOf(q)));

    const totals = series.map((s) => {
      let total = 0;
      s.points.forEach(p => {
        if (filteredIndices.has(p.qi)) total += (p.count || 0);
      });
      return { id: s.id, name: s.name, isMain: s.isMain, total };
    }).sort((a, b) => b.total - a.total);

    return { filteredQuarters: filtered, companyTotals: totals };
  }, [quarters, series, selectedDays]);

  if (!companyTotals.length) return null;

  const maxTotal = Math.max(...companyTotals.map(c => c.total), 1);

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 8 }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>Review Volume</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className="btn-secondary"
              onClick={() => setPeriod(opt.key)}
              style={{
                padding: '4px 10px',
                fontSize: '0.7rem',
                fontWeight: period === opt.key ? 700 : 400,
                background: period === opt.key ? 'var(--navy)' : undefined,
                color: period === opt.key ? '#fff' : undefined,
                borderColor: period === opt.key ? 'var(--navy)' : undefined,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
        Total reviews per company — quarters: {filteredQuarters.join(', ')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {companyTotals.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: c.isMain ? 600 : 400,
              color: 'var(--gray-700)',
              minWidth: 140,
              textAlign: 'right',
            }}>
              {c.name} {c.isMain ? '(You)' : ''}
            </span>
            <div style={{ flex: 1, height: 24, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${(c.total / maxTotal) * 100}%`,
                height: '100%',
                background: COLORS[i % COLORS.length],
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8,
                minWidth: c.total > 0 ? 40 : 0,
                transition: 'width 0.3s ease',
              }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff' }}>
                  {c.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuarterlyTrendChart({ quarterlyTrend }) {
  const { quarters, series } = quarterlyTrend || {};
  const [hidden, setHidden] = useState({});
  const [tooltip, setTooltip] = useState(null);

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

  const yMin = 1;
  const yMax = 5;
  const yRange = yMax - yMin;
  const yTicks = [1, 2, 3, 4, 5];

  const xScale = (qi) => PAD.left + (qi / (quarters.length - 1)) * plotW;
  const yScale = (val) => PAD.top + plotH - ((val - yMin) / yRange) * plotH;

  const toggleSeries = (id) => setHidden((prev) => ({ ...prev, [id]: !prev[id] }));

  // Build dot data for hover tooltips
  const allDots = [];
  visibleSeries.forEach((s) => {
    s.points.forEach((p) => {
      allDots.push({
        cx: xScale(p.qi),
        cy: yScale(p.val),
        seriesName: s.name,
        isMain: s.isMain,
        color: colorMap[s.id],
        quarter: quarters[p.qi],
        rating: p.val,
        count: p.count || 0,
        qi: p.qi,
        seriesId: s.id,
      });
    });
  });

  return (
    <>
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
        <h3 className="card-title">Quarterly Rating Trend</h3>
        <div style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}
            onMouseLeave={() => setTooltip(null)}
          >
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
              const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.qi)} ${yScale(p.val)}`).join(' ');
              return (
                <path key={s.id} d={pathD} fill="none" stroke={color} strokeWidth={s.isMain ? 2.5 : 1.5} opacity={0.9} />
              );
            })}

            {/* Dots for hover */}
            {allDots.map((dot, i) => (
              <circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r={tooltip && tooltip.qi === dot.qi && tooltip.seriesId === dot.seriesId ? 5 : 3}
                fill={dot.color}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const svg = e.target.ownerSVGElement;
                  const pt = svg.createSVGPoint();
                  pt.x = dot.cx;
                  pt.y = dot.cy;
                  const ctm = svg.getScreenCTM();
                  const screenPt = pt.matrixTransform(ctm);
                  const rect = svg.parentElement.getBoundingClientRect();
                  setTooltip({
                    ...dot,
                    x: screenPt.x - rect.left,
                    y: screenPt.y - rect.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y - 10,
              transform: 'translate(-50%, -100%)',
              background: '#0F1219',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: '0.75rem',
              lineHeight: 1.5,
              pointerEvents: 'none',
              zIndex: 10,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontWeight: 600 }}>{tooltip.seriesName} {tooltip.isMain ? '(You)' : ''}</div>
              <div>{tooltip.quarter}</div>
              <div>Rating: <strong>{tooltip.rating}</strong></div>
              <div>Reviews: <strong>{tooltip.count.toLocaleString()}</strong></div>
            </div>
          )}
        </div>

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

      <ReviewVolumeChart quarterlyTrend={quarterlyTrend} />
    </>
  );
}
