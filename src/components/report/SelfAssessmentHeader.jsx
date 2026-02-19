export default function SelfAssessmentHeader({ mainCompanyStats, project }) {
  const stats = mainCompanyStats;
  const stars = Math.round(stats.avgRating || 0);

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className="competitor-avatar">
          {project.mainCompanyLogoUrl
            ? <img src={project.mainCompanyLogoUrl} alt={project.mainCompany} />
            : project.mainCompany?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>
            {project.mainCompany} Self-Assessment
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
            {stats.avgRating}
          </div>
          <div style={{ color: 'var(--warning)', fontSize: '1rem', marginTop: '0.25rem' }}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </div>
        </div>
      </div>
      <div className="battlecard-stat-line" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value">{stats.reviewCount?.toLocaleString()}</div>
          <div className="battlecard-stat-label">Reviews Analyzed</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value" style={{ color: 'var(--success)' }}>{stats.positivePercent}%</div>
          <div className="battlecard-stat-label">Positive</div>
        </div>
        <div className="battlecard-stat">
          <div className="battlecard-stat-value" style={{ color: 'var(--danger)' }}>{stats.negativePercent}%</div>
          <div className="battlecard-stat-label">Negative</div>
        </div>
      </div>
    </div>
  );
}
