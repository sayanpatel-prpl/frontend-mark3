import Collapsible from './ui/Collapsible';

const SEVERITY_CLASSES = { HIGH: 'severity-critical', MEDIUM: 'severity-high', LOW: 'severity-medium' };

export default function SelfAssessmentBody({ selfAssessment }) {
  if (!selfAssessment) return null;

  return (
    <div>
      {/* Honest Self-Assessment Summary */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="card-title">Honest Self-Assessment</h3>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--gray-700)' }}>
          {selfAssessment.selfAssessmentSummary}
        </p>
      </div>

      {/* Real Strengths */}
      <Collapsible title="Real Strengths (What Customers Love)" defaultOpen>
        <div style={{ background: 'linear-gradient(135deg, var(--success-light) 0%, #A7F3D0 100%)', borderRadius: 8, padding: '1.25rem' }}>
          {(selfAssessment.realStrengths || []).map((s, i) => (
            <div key={i} className="advantage-card">
              <div className="advantage-title">{s.point}</div>
              <div className="advantage-proof">{s.evidence}</div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* Real Weaknesses */}
      <Collapsible title="Real Weaknesses (What Customers Complain About)" defaultOpen>
        {(selfAssessment.realWeaknesses || []).map((w, i) => (
          <div key={i} className="insight-card weakness-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div className="insight-text" style={{ marginBottom: 0 }}>{w.point}</div>
              <span className={`severity-badge ${SEVERITY_CLASSES[w.severity] || ''}`}>{w.severity}</span>
            </div>
            {w.evidence && <div className="insight-quote">{w.evidence}</div>}
            {w.competitorAmmo && (
              <div className="competitor-ammo">
                <strong>Competitor will say:</strong> {w.competitorAmmo}
              </div>
            )}
          </div>
        ))}
      </Collapsible>

      {/* Honest Caveats */}
      <Collapsible title="Honest Caveats (Don't Overclaim)">
        <ul className="caveat-list">
          {(selfAssessment.honestCaveats || []).map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Collapsible>

      {/* What Competitors Will Say */}
      <Collapsible title="What Competitors Will Say About Us" defaultOpen>
        {(selfAssessment.whatCompetitorsWillSay || []).map((a, i) => (
          <div key={i} className="competitor-attack-card">
            <div className="attack-line">
              <strong>Attack:</strong> "{a.attack}"
            </div>
            <div className="attack-reality">
              <strong>Reality:</strong> {a.reality}
            </div>
            <div className="attack-counter">
              <strong>Counter:</strong> {a.counterTalkTrack}
            </div>
          </div>
        ))}
      </Collapsible>
    </div>
  );
}
