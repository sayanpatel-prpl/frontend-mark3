import CompanyLogo from './CompanyLogo';
import SourceLinks from './SourceLinks';

// Normalize claims data: handles both grouped format ({ claim_area, companies, analysis })
// and flat format ({ name, claim, source_url }) from LLM responses
function normalizeClaims(data) {
  if (!data || data.length === 0) return [];

  // Already in grouped format
  if (data[0]?.claim_area && data[0]?.companies) return data;

  // Flat format: each item is a single company claim — group them into one card per item
  if (data[0]?.name && data[0]?.claim) {
    return data.map(item => ({
      claim_area: item.claim_area || item.category || item.name,
      companies: [{ name: item.name, claim: item.claim, source_url: item.source_url, source_title: item.source_title }],
      analysis: item.analysis || null,
    }));
  }

  return data;
}

export default function ClaimsAudit({ data, meta }) {
  const items = normalizeClaims(data);
  if (!items.length) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  return (
    <div className="card">
      <h3 className="section-title">Claims Comparison</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Side-by-side comparison of numeric claims across companies
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20,
            background: 'var(--gray-50)',
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 12 }}>
              {item.claim_area}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: item.analysis ? 12 : 0 }}>
              {item.companies?.map((c, j) => (
                <div key={j} style={{
                  flex: '1 1 200px', padding: 12, borderRadius: 6,
                  background: 'var(--white)', border: '1px solid var(--gray-200)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={24} />
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)' }}>{c.name}</div>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.5 }}>{c.claim}</div>
                  {c.source_url && <SourceLinks sources={[{ url: c.source_url, title: c.source_title }]} />}
                </div>
              ))}
            </div>
            {item.analysis && (
              <div style={{
                fontSize: '0.82rem', color: 'var(--gray-600)', fontStyle: 'italic',
                padding: '8px 12px', background: 'var(--white)', borderRadius: 6,
                borderLeft: '3px solid var(--azure)',
              }}>
                {item.analysis}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
