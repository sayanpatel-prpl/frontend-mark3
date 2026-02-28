import Collapsible from './ui/Collapsible';
import stripScores from './utils/stripScores';

const SEVERITY_CLASSES = { HIGH: 'severity-critical', MEDIUM: 'severity-high', LOW: 'severity-medium' };

export default function StrengthsWeaknesses({ battlecard }) {
  const { strengths = [], weaknesses = [] } = battlecard.sw || {};

  return (
    <Collapsible title="Strengths & Weaknesses" defaultOpen>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div className="subsection-label" style={{ color: 'var(--success)' }}>Strengths</div>
          {strengths.map((s, i) => (
            <div key={i} className="insight-card strength-card">
              <div className="insight-text">{stripScores(s.point)}</div>
              <div className="insight-quote">{stripScores(s.evidence)}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="subsection-label" style={{ color: 'var(--danger)' }}>Weaknesses</div>
          {weaknesses.map((w, i) => (
            <div key={i} className="insight-card weakness-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="insight-text" style={{ marginBottom: 0 }}>{stripScores(w.point)}</span>
                <span className={`severity-badge ${SEVERITY_CLASSES[w.severity] || ''}`}>{w.severity}</span>
              </div>
              <div className="insight-quote">{stripScores(w.evidence)}</div>
            </div>
          ))}
        </div>
      </div>
    </Collapsible>
  );
}
