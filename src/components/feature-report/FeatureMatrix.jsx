import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { Tooltip } from 'antd';
import CompanyLogo from './CompanyLogo';

const classColors = {
  advanced: { bg: '#7C3AED', text: '#fff' },
  enterprise_grade: { bg: '#2563EB', text: '#fff' },
  strong: { bg: '#059669', text: '#fff' },
  partial: { bg: '#D97706', text: '#fff' },
  basic: { bg: '#6B7280', text: '#fff' },
  none: { bg: '#E5E7EB', text: '#9CA3AF' },
};

const classLabels = {
  advanced: 'Advanced',
  enterprise_grade: 'Enterprise',
  strong: 'Strong',
  partial: 'Partial',
  basic: 'Basic',
  none: 'None',
};

function ClassBadge({ classification, onClick }) {
  const style = classColors[classification] || classColors.none;
  const isClickable = classification !== 'none';

  return (
    <span
      onClick={isClickable ? onClick : undefined}
      style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
        background: style.bg, color: style.text, whiteSpace: 'nowrap',
        cursor: isClickable ? 'pointer' : 'default',
        borderBottom: isClickable ? '2px dotted rgba(255,255,255,0.5)' : 'none',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
      }}
      onMouseEnter={e => { if (isClickable) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {classLabels[classification] || classification}
    </span>
  );
}

function FeatureDrawer({ feature, competitors, logoMap, highlightCompetitorId, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  // Sort: highlighted first, then by classification strength, none last
  const classOrder = { advanced: 0, enterprise_grade: 1, strong: 2, partial: 3, basic: 4, none: 5 };
  const sorted = [...competitors].sort((a, b) => {
    if (a.id === highlightCompetitorId) return -1;
    if (b.id === highlightCompetitorId) return 1;
    const ca = feature.competitors?.[a.id]?.classification || 'none';
    const cb = feature.competitors?.[b.id]?.classification || 'none';
    return (classOrder[ca] ?? 5) - (classOrder[cb] ?? 5);
  });

  const withData = sorted.filter(c => (feature.competitors?.[c.id]?.classification || 'none') !== 'none');
  const withoutData = sorted.filter(c => (feature.competitors?.[c.id]?.classification || 'none') === 'none');

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 18, 25, 0.55)',
          backdropFilter: 'blur(3px)', zIndex: 9998,
          opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 560, maxWidth: '92vw',
        background: 'var(--white, #fff)',
        zIndex: 9999,
        boxShadow: '-8px 0 48px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '28px 32px 22px',
          background: '#0F1219',
          color: '#fff',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '1.3rem', fontWeight: 700, margin: 0, lineHeight: 1.35,
                color: '#F8FAFC',
              }}>
                {feature.title || feature.feature}
              </h3>
              {feature.url && (
                <a href={feature.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 13, color: '#94A3B8', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8,
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                >
                  Source page <ArrowUpRight size={13} />
                </a>
              )}
            </div>
            <button onClick={handleClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              padding: 8, borderRadius: 8, color: '#94A3B8', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick summary bar */}
          <div style={{
            display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap',
          }}>
            {withData.map(c => {
              const cl = feature.competitors?.[c.id]?.classification || 'none';
              const colors = classColors[cl];
              return (
                <span key={c.id} style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 5,
                  background: colors.bg, color: colors.text, fontWeight: 600,
                  opacity: c.id === highlightCompetitorId ? 1 : 0.75,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <CompanyLogo name={c.name} logoUrl={logoMap?.[c.name]} size={14} />
                  {c.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, overflow: 'auto', padding: '24px 32px',
        }}>
          {withData.map(c => {
            const comp = feature.competitors?.[c.id];
            const classification = comp?.classification || 'none';
            const colors = classColors[classification];
            const isHighlighted = c.id === highlightCompetitorId;

            return (
              <div key={c.id} style={{
                marginBottom: 20,
                borderLeft: `4px solid ${isHighlighted ? colors.bg : 'var(--gray-200)'}`,
                paddingLeft: 20,
                paddingBottom: 4,
                transition: 'border-color 0.2s',
              }}>
                {/* Competitor name + logo + badge row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 10,
                }}>
                  <CompanyLogo name={c.name} logoUrl={logoMap?.[c.name]} size={24} />
                  <span style={{
                    fontSize: '1.05rem', fontWeight: 700,
                    color: isHighlighted ? 'var(--navy)' : 'var(--gray-800)',
                  }}>
                    {c.name}
                  </span>
                  <span style={{
                    padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                    background: colors.bg, color: colors.text,
                  }}>
                    {classLabels[classification]}
                  </span>
                </div>

                {/* Matched feature */}
                {comp?.matched_feature && (
                  <div style={{ fontSize: 15, color: 'var(--gray-700)', marginBottom: 8 }}>
                    {comp.matched_url ? (
                      <a href={comp.matched_url} target="_blank" rel="noopener noreferrer" style={{
                        color: '#2563EB', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {comp.matched_feature}
                        <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                      </a>
                    ) : (
                      <span style={{ fontWeight: 500 }}>{comp.matched_feature}</span>
                    )}
                  </div>
                )}

                {/* Reason */}
                {comp?.reason && (
                  <div style={{
                    fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7,
                  }}>
                    {comp.reason}
                  </div>
                )}
              </div>
            );
          })}

          {/* None competitors */}
          {withoutData.length > 0 && (
            <div style={{
              marginTop: 12, paddingTop: 18,
              borderTop: '1px solid var(--gray-200)',
            }}>
              <div style={{
                fontSize: 13, color: 'var(--gray-400)', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
              }}>
                <span>No coverage &mdash;</span>
                {withoutData.map(c => (
                  <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap?.[c.name]} size={16} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

export default function FeatureMatrix({ data, meta }) {
  if (!data || data.length === 0) return null;

  const competitors = meta.competitors || [];
  const logoMap = {};
  for (const c of [meta.main_company, ...competitors].filter(Boolean)) {
    logoMap[c.name] = c.logo_url;
  }
  const [drawer, setDrawer] = useState(null);

  const openDrawer = useCallback((feature, competitorId) => {
    setDrawer({ feature, highlightCompetitorId: competitorId });
  }, []);

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <h3 className="section-title">Feature Matrix</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        {meta.main_company?.name} has {meta.main_features_count} product features compared against {competitors.length} competitors
      </p>

      {data.map((group, gi) => (
        <div key={gi} style={{ marginBottom: gi < data.length - 1 ? 24 : 0 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.95rem', color: 'var(--azure)',
            marginBottom: 10, paddingBottom: 6,
            borderBottom: '2px solid var(--gray-200)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {group.category}
            <span style={{
              fontSize: 11, fontWeight: 500, color: 'var(--gray-500)',
              background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 10,
            }}>
              {group.features?.length} features
            </span>
          </div>

          <table className="comparison-matrix" style={{ minWidth: 600, marginBottom: 0 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 340 }}>Feature</th>
                {competitors.map(c => (
                  <th key={c.id} style={{ textAlign: 'center', minWidth: 110 }}>
                    <Tooltip title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={16} />{c.name}</span>}>
                      {c.name}
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(group.features || []).map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {row.url ? (
                      <Tooltip title={row.url}>
                      <a href={row.url} target="_blank" rel="noopener noreferrer"
                        className="feature-link"
                        style={{
                          color: 'var(--azure)', textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          transition: 'color 0.15s ease',
                        }}
                      >
                        <span style={{ borderBottom: '1px dashed var(--gray-400)' }}>
                          {row.title || (row.feature?.length > 60 ? row.feature.slice(0, 60) + '...' : row.feature)}
                        </span>
                        <ExternalLink size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                      </a>
                      </Tooltip>
                    ) : (
                      <span style={{ color: 'var(--navy)' }}>
                        {row.title || (row.feature?.length > 60 ? row.feature.slice(0, 60) + '...' : row.feature)}
                      </span>
                    )}
                  </td>
                  {competitors.map(c => {
                    const comp = row.competitors?.[c.id];
                    return (
                      <td key={c.id} style={{ textAlign: 'center' }}>
                        <ClassBadge
                          classification={comp?.classification || 'none'}
                          onClick={() => openDrawer(row, c.id)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--gray-200)' }}>
        {Object.entries(classLabels).map(([key, label]) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-600)' }}>
            <span style={{
              display: 'inline-block', width: 12, height: 12, borderRadius: 3,
              background: classColors[key].bg,
            }} />
            {label}
          </span>
        ))}
      </div>

      {drawer && (
        <FeatureDrawer
          feature={drawer.feature}
          competitors={competitors}
          logoMap={logoMap}
          highlightCompetitorId={drawer.highlightCompetitorId}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  );
}
