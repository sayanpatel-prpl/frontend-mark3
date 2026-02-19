import SourceLinks from './SourceLinks';

function stripMarkdownLinks(text) {
  if (!text) return text;
  // Remove [text](url) markdown links and [Source](url) patterns
  return text.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1').replace(/\s*\[Source\]/gi, '').trim();
}

const severityColors = {
  critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
  high: { bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  medium: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF' },
};

export default function GapAnalysis({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <h3 className="section-title">Feature Gap Analysis</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Top {data.length} capability gaps where competitors have stronger offerings
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((gap, i) => {
          const sev = severityColors[gap.severity] || severityColors.medium;
          return (
            <div key={i} style={{
              border: `1px solid ${sev.border}`, borderLeft: `4px solid ${sev.border}`,
              borderRadius: 8, padding: 20, background: sev.bg,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong style={{ color: sev.text, fontSize: '0.95rem' }}>{gap.feature_area}</strong>
                <span style={{
                  padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: sev.border, color: '#fff', textTransform: 'uppercase',
                }}>{gap.severity}</span>
              </div>
              <p style={{ color: sev.text, margin: '0 0 10px', fontSize: '0.85rem', lineHeight: 1.6 }}>{stripMarkdownLinks(gap.description)}</p>
              <div style={{ fontSize: '0.82rem', color: sev.text, opacity: 0.85 }}>
                <strong>Evidence:</strong> {stripMarkdownLinks(gap.evidence)}
              </div>
              {gap.competitors_ahead?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: '0.82rem', color: sev.text, opacity: 0.85 }}>
                  <strong>Ahead:</strong> {gap.competitors_ahead.join(', ')}
                </div>
              )}
              <SourceLinks sources={gap.sources || gap.source_urls} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
