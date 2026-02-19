import Collapsible from './ui/Collapsible';

export default function LandmineQuestions({ battlecard }) {
  const questions = battlecard.sw?.landmineQuestions || [];
  if (questions.length === 0) return null;

  return (
    <Collapsible title="Landmine Questions" defaultOpen>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.map((q, i) => (
          <div key={i} className="landmine-card">
            <span className="capability-tag">{q.capability}</span>

            <div className="landmine-step">
              <div className="step-label">Setup</div>
              <div className="step-text">{q.setup}</div>
            </div>

            <div className="landmine-step" style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 6, borderLeft: '3px solid var(--azure)' }}>
              <div className="step-label" style={{ color: 'var(--azure)' }}>Ask</div>
              <div className="step-question">"{q.question}"</div>
            </div>

            <div className="landmine-step">
              <div className="step-label">Listen For</div>
              <div className="step-text" style={{ color: 'var(--warning)' }}>{q.listenFor}</div>
            </div>

            <div className="respond-step">
              <div className="step-label">Your Response</div>
              <div className="step-text">{q.yourResponse}</div>
            </div>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
