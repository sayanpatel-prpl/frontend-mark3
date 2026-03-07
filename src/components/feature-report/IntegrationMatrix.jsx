import { Tooltip } from 'antd';
import CompanyLogo from './CompanyLogo';

export default function IntegrationMatrix({ data, meta }) {
  if (!data || data.length === 0) return null;

  const allCompanyObjs = [meta.main_company, ...meta.competitors].filter(Boolean);
  const allCompanies = allCompanyObjs.map(c => c.name);
  const logoMap = {};
  for (const c of allCompanyObjs) {
    logoMap[c.name] = c.logo_url;
  }

  // Detect data shape: new (subcategories) vs old (flat integrations)
  const hasSubcategories = data[0]?.subcategories?.length > 0;

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <h3 className="section-title">Integration Coverage</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        Integration support by category across companies
      </p>
      <div style={{ display: 'flex', gap: 16, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--gray-600)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 14 }}>&#10003;</span>
          Verified on website
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--azure)', fontSize: 14 }}>&#9679;</span>
          Known integration
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--gray-400)' }}>&#8212;</span>
          Not found
        </span>
      </div>

      {data.map((category, i) => (
        <div key={i} style={{ marginBottom: i < data.length - 1 ? 28 : 0 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.95rem', color: 'var(--azure)',
            marginBottom: 12, paddingBottom: 6,
            borderBottom: '2px solid var(--gray-200)',
          }}>
            {category.category}
          </div>

          {hasSubcategories ? (
            (category.subcategories || []).map((sub, si) => (
              <div key={si} style={{ marginBottom: si < (category.subcategories?.length || 0) - 1 ? 16 : 0 }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)',
                  marginBottom: 6, paddingLeft: 4,
                }}>
                  {sub.subcategory}
                </div>
                <IntegrationTable integrations={sub.integrations} allCompanies={allCompanies} logoMap={logoMap} />
              </div>
            ))
          ) : (
            <IntegrationTable integrations={category.integrations} allCompanies={allCompanies} logoMap={logoMap} />
          )}
        </div>
      ))}
    </div>
  );
}

function IntegrationTable({ integrations, allCompanies, logoMap }) {
  if (!integrations?.length) return null;

  return (
    <table className="comparison-matrix" style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th style={{ minWidth: 140 }}>Integration</th>
          {allCompanies.map(name => (
            <th key={name} style={{ textAlign: 'center', minWidth: 80 }}>
              <Tooltip title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><CompanyLogo name={name} logoUrl={logoMap[name]} size={16} />{name}</span>}>
                {name}
              </Tooltip>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {integrations.map((int, j) => (
          <tr key={j}>
            <td style={{ fontSize: '0.85rem' }}>{int.name}</td>
            {allCompanies.map(name => {
              const isVerified = int.companies_verified?.includes(name);
              const isKnown = int.companies_known?.includes(name);
              const isLegacy = !int.companies_verified && !int.companies_known && int.companies?.includes(name);
              const sourceUrl = int.source_urls?.find(u => u);

              if (isVerified || isLegacy) {
                return (
                  <td key={name} style={{ textAlign: 'center' }}>
                    {sourceUrl
                      ? <Tooltip title={sourceUrl}><a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--success)', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>&#10003;</a></Tooltip>
                      : <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 16 }}>&#10003;</span>
                    }
                  </td>
                );
              }

              if (isKnown) {
                return (
                  <td key={name} style={{ textAlign: 'center' }}>
                    {sourceUrl
                      ? <Tooltip title={sourceUrl}><a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--azure)', fontSize: 14, textDecoration: 'none' }}>&#9679;</a></Tooltip>
                      : <Tooltip title="Known integration (not verified on website)"><span style={{ color: 'var(--azure)', fontSize: 14 }}>&#9679;</span></Tooltip>
                    }
                  </td>
                );
              }

              return (
                <td key={name} style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--gray-400)' }}>&#8212;</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
