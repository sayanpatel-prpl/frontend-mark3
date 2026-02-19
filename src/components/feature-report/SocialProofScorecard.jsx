import SourceLinks from './SourceLinks';

const strengthColors = {
  strong: { bg: '#D1FAE5', color: '#065F46', label: 'Strong' },
  moderate: { bg: '#FEF3C7', color: '#92400E', label: 'Moderate' },
  weak: { bg: '#FEE2E2', color: '#991B1B', label: 'Weak' },
};

const awardIcons = {
  g2: { emoji: '\u2B50', color: '#FF492C' },
  gartner: { emoji: '\uD83C\uDFC6', color: '#00338D' },
  forrester: { emoji: '\uD83C\uDF96\uFE0F', color: '#5C2D91' },
  default: { emoji: '\uD83C\uDFC5', color: '#7C3AED' },
};

function getAwardStyle(award) {
  const lower = (award || '').toLowerCase();
  if (lower.includes('g2')) return awardIcons.g2;
  if (lower.includes('gartner')) return awardIcons.gartner;
  if (lower.includes('forrester')) return awardIcons.forrester;
  return awardIcons.default;
}

export default function SocialProofScorecard({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <h3 className="section-title">Customer & Industry Recognition</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Customer evidence, testimonials, and recognition across companies
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {data.map((item, i) => {
          const str = strengthColors[item.proof_strength] || strengthColors.moderate;
          return (
            <div key={i} style={{
              border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20,
              background: 'var(--gray-50)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <strong style={{ fontSize: '1rem', color: 'var(--navy)' }}>{item.company}</strong>
                <span style={{
                  padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: str.bg, color: str.color,
                }}>{str.label}</span>
              </div>

              {item.named_customers?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: 6 }}>Named Customers</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {item.named_customers.slice(0, 8).map((c, j) => (
                      <span key={j} style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 11,
                        background: 'var(--white)', color: 'var(--gray-700)',
                        border: '1px solid var(--gray-200)',
                      }}>{c}</span>
                    ))}
                    {item.named_customers.length > 8 && (
                      <span style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 11,
                        background: 'var(--gray-200)', color: 'var(--gray-600)',
                      }}>+{item.named_customers.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}

              {item.testimonial_highlights?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: 6 }}>Key Testimonial</div>
                  <div style={{
                    fontSize: '0.82rem', color: 'var(--gray-700)', fontStyle: 'italic',
                    padding: '10px 14px', background: 'var(--white)', borderRadius: 6,
                    borderLeft: '3px solid var(--azure)',
                  }}>
                    &ldquo;{item.testimonial_highlights[0]}&rdquo;
                  </div>
                </div>
              )}

              {item.awards?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: 6 }}>Awards & Recognition</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {item.awards.map((a, j) => {
                      const aStyle = getAwardStyle(a);
                      return (
                        <div key={j} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '6px 10px', borderRadius: 6,
                          background: 'var(--white)', border: '1px solid var(--gray-200)',
                        }}>
                          <span style={{ fontSize: 14 }}>{aStyle.emoji}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-800)', fontWeight: 500 }}>{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{
                fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: 10,
                padding: '8px 12px', background: 'var(--white)', borderRadius: 6,
                borderLeft: `3px solid ${str.color}`,
              }}>
                {item.summary}
              </div>

              <SourceLinks sources={item.source_urls} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
