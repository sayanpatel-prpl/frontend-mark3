import ThreatBadge from './ThreatBadge';

export default function ThreatCards({ competitors }) {
  return (
    <div className="threat-cards-grid">
      {competitors.map((c) => (
        <div className="threat-card" key={c.id}>
          <div className="threat-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {c.logoUrl && (
                <img src={c.logoUrl} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'contain' }} />
              )}
              <h4>{c.name}</h4>
            </div>
            <ThreatBadge level={c.threat?.threatLevel} />
          </div>
          <p className="threat-summary">
            {c.threat?.threatSummary || 'No threat summary available.'}
          </p>
          {c.threat?.quickDismiss && (
            <div className="threat-dismiss">{c.threat.quickDismiss}</div>
          )}
        </div>
      ))}
    </div>
  );
}
