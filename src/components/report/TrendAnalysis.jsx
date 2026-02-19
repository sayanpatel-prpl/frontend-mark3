import Collapsible from './ui/Collapsible';

export default function TrendAnalysis({ comp }) {
  const trend = comp.trendAnalysis;
  if (!trend) return null;

  const dirClass = trend.direction === 'improving' ? 'improving'
    : trend.direction === 'declining' ? 'declining' : 'stable';

  const dirArrow = trend.direction === 'improving' ? '↑'
    : trend.direction === 'declining' ? '↓' : '—';

  return (
    <Collapsible title="Trend Analysis">
      <div className="pricing-grid">
        {trend.periods.map((p) => (
          <div className="pricing-block" key={p.label}>
            <div className="pricing-block-label">{p.label}</div>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>
              {p.avgRating != null ? p.avgRating : 'N/A'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
              {p.count} reviews in window
            </p>
          </div>
        ))}
      </div>
      <div className="pricing-sentiment-bar">
        <div className="pricing-block-label">Overall Direction</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className={`trend-direction ${dirClass}`} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
            <span>{dirArrow}</span>
            <span style={{ textTransform: 'capitalize' }}>{trend.direction}</span>
          </div>
        </div>
      </div>
    </Collapsible>
  );
}
