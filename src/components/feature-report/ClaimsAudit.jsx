import CompanyLogo from './CompanyLogo';
import SourceLinks from './SourceLinks';

export default function ClaimsAudit({ data, meta }) {
  if (!data || data.length === 0) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  return (
    <div className="card">
      <h3 className="section-title">Claims Audit</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Side-by-side comparison of numeric claims across companies
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((item, i) => (
          <div key={i} style={{
            border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20,
            background: 'var(--gray-50)',
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 12 }}>
              {item.claim_area}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              {item.companies?.map((c, j) => (
                <div key={j} style={{
                  flex: '1 1 200px', padding: 12, borderRadius: 6,
                  background: 'var(--white)', border: '1px solid var(--gray-200)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={18} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)' }}>{c.name}</div>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-900)' }}>{c.claim}</div>
                  {c.source_url && <SourceLinks sources={[{ url: c.source_url, title: c.source_title }]} />}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: '0.82rem', color: 'var(--gray-600)', fontStyle: 'italic',
              padding: '8px 12px', background: 'var(--white)', borderRadius: 6,
              borderLeft: '3px solid var(--azure)',
            }}>
              {item.analysis}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
