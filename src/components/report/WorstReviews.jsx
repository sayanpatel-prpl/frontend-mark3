import Collapsible from './ui/Collapsible';

function StarRating({ score }) {
  if (score == null) return null;
  const stars = Math.round(score);
  return (
    <span style={{ color: 'var(--warning)', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
    </span>
  );
}

function isLegitName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  const placeholders = ['anonymous', 'anon', 'unknown', 'user', 'n/a', 'na', 'none', 'verified user', 'a user'];
  return !placeholders.includes(trimmed.toLowerCase());
}

export default function WorstReviews({ comp }) {
  const reviews = comp.damagingReviews || [];
  if (reviews.length === 0) return null;

  return (
    <Collapsible title="Worst Reviews">
      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
        Ranked by severity: low star rating, specific complaints, quantified pain points, and detail depth.
      </p>
      {reviews.map((r, i) => (
        <div key={i} className="damaging-review">
          <div className="damaging-header">
            <span className="damaging-rank">#{i + 1}</span>
            {r.score != null && <StarRating score={r.score} />}
            {isLegitName(r.reviewer_name) && (
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-700)' }}>{r.reviewer_name}</span>
            )}
            {r.reviewer_segment && <span className="damaging-segment">{r.reviewer_segment}</span>}
            {r.damage_score != null && (
              <span className="damage-score-badge">Damage: {r.damage_score}</span>
            )}
          </div>
          {r.title && <div className="damaging-title">{r.title}</div>}
          <div className="damaging-quote">"{r.ai_summary}"</div>
          {r.helpful_count > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
              {r.helpful_count} people found this helpful
            </div>
          )}
        </div>
      ))}
    </Collapsible>
  );
}
