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

export default function ComparisonMatrix({ competitors, mainCompanyStats, project }) {
  const rows = [
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
  ];

  return (
    <div className="card" style={{ overflow: 'auto', marginBottom: '1.5rem' }}>
      <table className="comparison-matrix">
        <thead>
          <tr>
            <th>Company</th>
            <th>Reviews</th>
            <th>Avg Rating</th>
            <th>Positive</th>
            <th>Neutral</th>
            <th>Negative</th>
            <th>Trend</th>
            <th>Top Complaint</th>
            <th>Threat</th>
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
