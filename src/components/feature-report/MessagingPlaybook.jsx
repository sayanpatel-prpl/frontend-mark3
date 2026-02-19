import CompanyLogo from './CompanyLogo';

export default function MessagingPlaybook({ data, meta }) {
  if (!data || data.length === 0) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  return (
    <div className="card">
      <h3 className="section-title">Competitor Messaging Playbook</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        How competitors position themselves and how to counter their messaging
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {data.map((item, i) => (
          <div key={i} style={{
            border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20,
            background: 'var(--gray-50)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <CompanyLogo name={item.company} logoUrl={logoMap[item.company]} size={28} />
              <h4 style={{ fontSize: '1.05rem', color: 'var(--navy)', margin: 0, fontWeight: 700 }}>{item.company}</h4>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--azure)', marginBottom: 6,
              }}>Positioning</div>
              <div style={{
                fontSize: '0.88rem', color: 'var(--gray-700)', lineHeight: 1.6,
                padding: '10px 14px', background: 'var(--white)', borderRadius: 6,
                borderLeft: '3px solid var(--azure)',
              }}>{item.positioning}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--data-emerald)', marginBottom: 8,
                }}>Key Messages</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {item.key_messages?.map((m, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '8px 12px', background: 'var(--white)', borderRadius: 6,
                      border: '1px solid var(--gray-200)',
                    }}>
                      <span style={{
                        flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                        background: '#D1FAE5', color: '#065F46',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, marginTop: 1,
                      }}>{j + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--data-amber)', marginBottom: 8,
                }}>Pain Points Targeted</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {item.pain_points_targeted?.map((p, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '8px 12px', background: 'var(--white)', borderRadius: 6,
                      border: '1px solid var(--gray-200)',
                    }}>
                      <span style={{
                        flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                        background: '#D97706', marginTop: 7,
                      }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {item.overpromises?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--danger)', marginBottom: 6,
                }}>Overpromises / Buzzwords</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.overpromises.map((o, j) => (
                    <span key={j} style={{
                      padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                      background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA',
                    }}>{o}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              padding: 14, borderRadius: 8, background: '#EBF5FF', border: '1px solid #BFDBFE',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1E40AF', marginBottom: 6 }}>Counter Strategy</div>
              <div style={{ fontSize: '0.88rem', color: '#1E40AF', lineHeight: 1.6 }}>{item.counter_strategy}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
