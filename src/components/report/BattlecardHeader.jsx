import ThreatBadge from './ThreatBadge';

export default function BattlecardHeader({ comp }) {
  const { stats, threat } = comp;

  const trendArrow = stats.trend === 'improving' ? '↑'
    : stats.trend === 'declining' ? '↓' : '→';

  const trendClass = stats.trend === 'improving' ? 'trend-direction improving'
    : stats.trend === 'declining' ? 'trend-direction declining'
    : 'trend-direction stable';

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
        <div className="competitor-avatar">
          {comp.logoUrl ? <img src={comp.logoUrl} alt={comp.name} /> : comp.name?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>
            {comp.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ThreatBadge level={threat?.threatLevel} />
            <div className={trendClass} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8125rem' }}>
              <span>{trendArrow}</span>
              <span style={{ textTransform: 'capitalize' }}>{stats.trend}</span>
              <span style={{ opacity: 0.8 }}>({stats.trendDelta > 0 ? '+' : ''}{stats.trendDelta})</span>
            </div>
          </div>
        </div>
      </div>

      {threat?.execSummary && (
        <div className="exec-summary">
          <div className="exec-summary-label">Executive Summary</div>
          <p>{threat.execSummary}</p>
        </div>
      )}

      {threat?.quickDismiss && (
        <div className="quick-dismiss">
          <strong>Quick Dismiss:</strong> {threat.quickDismiss}
        </div>
      )}

      <div className="battlecard-stat-line">
        <div className="battlecard-stat">
          <div className="battlecard-stat-value">{stats.reviewCount?.toLocaleString()}</div>
          <div className="battlecard-stat-label">Reviews</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value">{stats.avgRating}</div>
          <div className="battlecard-stat-label">Avg Rating</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value" style={{ color: 'var(--success)' }}>{stats.positivePercent}%</div>
          <div className="battlecard-stat-label">Positive</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value" style={{ color: 'var(--danger)' }}>{stats.negativePercent}%</div>
          <div className="battlecard-stat-label">Negative</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value">{stats.neutralPercent}%</div>
          <div className="battlecard-stat-label">Neutral</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value" style={{ fontSize: '0.875rem' }}>{stats.topComplaint}</div>
          <div className="battlecard-stat-label">Top Complaint</div>
        </div>
      </div>
    </div>
  );
}
