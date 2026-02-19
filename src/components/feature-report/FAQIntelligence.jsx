import SourceLinks from './SourceLinks';

export default function FAQIntelligence({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <h3 className="section-title">FAQ Intelligence</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Common buyer concerns revealed by competitor FAQ pages
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((item, i) => (
          <div key={i} style={{
            border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20,
            background: 'var(--gray-50)',
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 8 }}>
              {item.theme}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', margin: '0 0 12px', lineHeight: 1.6 }}>
              {item.description}
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>Addressing: </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                  {item.companies_addressing?.join(', ') || 'None'}
                </span>
              </div>
              {item.companies_silent?.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--danger)' }}>Silent: </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                    {item.companies_silent.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div style={{
              fontSize: '0.82rem', color: 'var(--azure)', fontStyle: 'italic',
              padding: '10px 14px', background: 'var(--white)', borderRadius: 6,
              border: '1px solid var(--gray-200)', borderLeft: '3px solid var(--azure)',
            }}>
              {item.insight}
            </div>

            <SourceLinks sources={item.source_urls} />
          </div>
        ))}
      </div>
    </div>
  );
}
