import { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Info } from 'lucide-react';
import ThreatBadge from './ThreatBadge';

const trendArrow = (trend) => {
  if (trend === 'improving') return '↑';
  if (trend === 'declining') return '↓';
  return '→';
};

const trendClass = (trend) => {
  if (trend === 'improving') return 'trend-up';
  if (trend === 'declining') return 'trend-down';
  return 'trend-stable';
};

const THREAT_ORDER = { HIGH: 3, MEDIUM: 2, LOW: 1 };

const TREND_INFO = 'Trend compares the average review rating from the last 6 months against the older period. Improving = recent avg is 0.15+ higher, Declining = 0.15+ lower, Stable = within 0.15. The delta shows the exact difference.';

const COLUMNS = [
  { key: 'name', label: 'Company', align: 'left' },
  { key: 'reviewCount', label: 'Reviews' },
  { key: 'avgRating', label: 'Avg Rating' },
  { key: 'positivePercent', label: 'Positive' },
  { key: 'neutralPercent', label: 'Neutral' },
  { key: 'negativePercent', label: 'Negative' },
  { key: 'trend', label: 'Trend', info: TREND_INFO },
  { key: 'topComplaint', label: 'Top Complaint' },
  { key: 'threat', label: 'Threat' },
];

function getSortValue(row, key) {
  if (key === 'name') return row.name?.toLowerCase() || '';
  if (key === 'threat') return THREAT_ORDER[row.threat?.threatLevel] || 0;
  if (key === 'topComplaint') return row.stats.topComplaint || '';
  if (key === 'trend') {
    const order = { improving: 3, stable: 2, declining: 1 };
    return order[row.stats.trend] || 0;
  }
  return row.stats[key] ?? 0;
}

function HeaderInfoIcon({ text }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleEnter = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setShow(true);
  }, []);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 4, cursor: 'help' }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <Info size={12} style={{ color: '#9CA3AF' }} />
      {show && (
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          background: '#0F1219',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          fontSize: '0.7rem',
          lineHeight: 1.6,
          width: 280,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          fontWeight: 400,
          textTransform: 'none',
          letterSpacing: 'normal',
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

export default function ComparisonMatrix({ competitors, mainCompanyStats, project }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const allRows = useMemo(() => [
    {
      key: 'main',
      name: project.mainCompany,
      isMain: true,
      logoUrl: project.mainCompanyLogoUrl,
      stats: mainCompanyStats,
      threat: null,
    },
    ...competitors.map((c) => ({
      key: c.id,
      name: c.name,
      isMain: false,
      logoUrl: c.logoUrl,
      stats: c.stats,
      threat: c.threat,
    })),
  ], [competitors, mainCompanyStats, project]);

  const rows = useMemo(() => {
    if (!sortKey) return allRows;
    const sorted = [...allRows].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [allRows, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="card" style={{ overflow: 'auto', marginBottom: '1.5rem' }}>
      <table className="comparison-matrix">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: 'pointer', userSelect: 'none', textAlign: col.align || 'center' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.info && <HeaderInfoIcon text={col.info} />}
                  {sortKey === col.key ? (
                    sortDir === 'asc'
                      ? <ChevronUp size={12} style={{ opacity: 0.9 }} />
                      : <ChevronDown size={12} style={{ opacity: 0.9 }} />
                  ) : (
                    <ChevronsUpDown size={12} style={{ opacity: 0.3 }} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={row.isMain ? 'main-company-row' : ''}>
              <td className="matrix-name">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {row.logoUrl && (
                    <img src={row.logoUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }} />
                  )}
                  {row.name}
                </span>
              </td>
              <td className="matrix-cell">{row.stats.reviewCount?.toLocaleString()}</td>
              <td className="matrix-cell">{row.stats.avgRating || '-'}</td>
              <td className="matrix-cell" style={{ color: 'var(--success)' }}>
                {row.stats.positivePercent != null ? `${row.stats.positivePercent}%` : '-'}
              </td>
              <td className="matrix-cell" style={{ color: 'var(--gray-600)' }}>
                {row.stats.neutralPercent != null ? `${row.stats.neutralPercent}%` : '-'}
              </td>
              <td className="matrix-cell" style={{ color: 'var(--danger)' }}>
                {row.stats.negativePercent != null ? `${row.stats.negativePercent}%` : '-'}
              </td>
              <td className={trendClass(row.stats.trend)}>
                <span>{trendArrow(row.stats.trend)} {row.stats.trend} ({row.stats.trendDelta > 0 ? '+' : ''}{row.stats.trendDelta})</span>
              </td>
              <td style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                {row.stats.topComplaint !== 'N/A' ? `${row.stats.topComplaint} (${row.stats.topComplaintPercent}%)` : '-'}
              </td>
              <td>{row.isMain ? <span className="data-source-tag computed-tag">YOU</span> : <ThreatBadge level={row.threat?.threatLevel} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
