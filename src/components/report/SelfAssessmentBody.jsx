import Collapsible from './ui/Collapsible';
import stripScores from './utils/stripScores';

const SEVERITY_CLASSES = { HIGH: 'severity-critical', MEDIUM: 'severity-high', LOW: 'severity-medium' };

export default function SelfAssessmentBody({ selfAssessment }) {
  if (!selfAssessment) return null;

  return (
    <div>
      {/* Honest Self-Assessment Summary */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="card-title">Honest Self-Assessment</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {(selfAssessment.selfAssessmentSummary || '').split(/(?<=[.!?])\s+/).filter(s => s.trim()).map((sentence, i) => (
            <li key={i} style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
              {stripScores(sentence.trim())}
            </li>
          ))}
        </ul>
      </div>

      {/* Real Strengths */}
      <Collapsible title="Real Strengths (What Customers Love)" defaultOpen>
        <div style={{ background: 'var(--success-light)', borderRadius: 8, padding: '1.25rem' }}>
          {(selfAssessment.realStrengths || []).map((s, i) => (
            <div key={i} className="advantage-card">
              <div className="advantage-title">{stripScores(s.point)}</div>
              <div className="advantage-proof">{stripScores(s.evidence)}</div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* Real Weaknesses */}
      <Collapsible title="Real Weaknesses (What Customers Complain About)" defaultOpen>
        {(selfAssessment.realWeaknesses || []).map((w, i) => (
          <div key={i} className="insight-card weakness-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div className="insight-text" style={{ marginBottom: 0 }}>{stripScores(w.point)}</div>
              <span className={`severity-badge ${SEVERITY_CLASSES[w.severity] || ''}`}>{w.severity}</span>
            </div>
            {w.evidence && <div className="insight-quote">{stripScores(w.evidence)}</div>}
            {w.competitorAmmo && (
              <div className="competitor-ammo">
                <strong>Competitor will say:</strong> {stripScores(w.competitorAmmo)}
              </div>
            )}
          </div>
        ))}
      </Collapsible>

      {/* Honest Caveats */}
      <Collapsible title="Honest Caveats (Don't Overclaim)">
        <ul className="caveat-list">
          {(selfAssessment.honestCaveats || []).map((c, i) => (
            <li key={i}>{stripScores(c)}</li>
          ))}
        </ul>
      </Collapsible>

      {/* What Competitors Will Say */}
      <Collapsible title="What Competitors Will Say About Us" defaultOpen>
        {(selfAssessment.whatCompetitorsWillSay || []).map((a, i) => (
          <div key={i} className="competitor-attack-card">
            <div className="attack-line">
              <strong>Attack:</strong> "{stripScores(a.attack)}"
            </div>
            <div className="attack-reality">
              <strong>Reality:</strong> {stripScores(a.reality)}
            </div>
            <div className="attack-counter">
              <strong>Counter:</strong> {stripScores(a.counterTalkTrack)}
            </div>
          </div>
        ))}
      </Collapsible>
    </div>
  );
}
