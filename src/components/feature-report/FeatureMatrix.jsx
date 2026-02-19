import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

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

function ClassBadge({ classification, reason, matchedFeature, matchedUrl }) {
  const [showTip, setShowTip] = useState(false);
  const [tipPos, setTipPos] = useState({ top: 0, left: 0 });
  const badgeRef = useRef(null);
  const hideTimer = useRef(null);
  const style = classColors[classification] || classColors.none;
  const hasContent = classification !== 'none' && (reason || matchedFeature);

  const show = useCallback(() => {
    clearTimeout(hideTimer.current);
    if (!hasContent || !badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const tipWidth = 280;
    let left = rect.left + rect.width / 2;
    if (left - tipWidth / 2 < 8) left = tipWidth / 2 + 8;
    if (left + tipWidth / 2 > window.innerWidth - 8) left = window.innerWidth - tipWidth / 2 - 8;
    let top = rect.bottom + 8;
    if (top + 120 > window.innerHeight) top = rect.top - 8;
    setTipPos({ top, left, above: top !== rect.bottom + 8 });
    setShowTip(true);
  }, [hasContent]);

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setShowTip(false), 150);
  }, []);

  const tipEnter = useCallback(() => clearTimeout(hideTimer.current), []);

  // Derive a short title from matchedUrl
  const linkTitle = matchedUrl ? (() => {
    try {
      const u = new URL(matchedUrl);
      const path = u.pathname.replace(/\/$/, '').split('/').pop() || '';
      return path.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || u.hostname;
    } catch { return 'View Source'; }
  })() : null;

  return (
    <span
      ref={badgeRef}
      style={{ display: 'inline-block' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
        background: style.bg, color: style.text, whiteSpace: 'nowrap',
        cursor: hasContent ? 'help' : 'default',
        borderBottom: hasContent ? '2px dotted rgba(255,255,255,0.5)' : 'none',
      }}>
        {classLabels[classification] || classification}
      </span>
      {showTip && createPortal(
        <div
          onMouseEnter={tipEnter}
          onMouseLeave={hide}
          style={{
            position: 'fixed', top: tipPos.above ? undefined : tipPos.top, bottom: tipPos.above ? `calc(100vh - ${tipPos.top}px)` : undefined,
            left: tipPos.left, transform: 'translateX(-50%)',
            background: '#1E293B', color: '#E2E8F0', padding: '10px 14px', borderRadius: 10,
            fontSize: 12, lineHeight: 1.5, maxWidth: 280, minWidth: 180,
            boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
            zIndex: 10000, whiteSpace: 'normal',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <div style={{
            position: 'absolute', [tipPos.above ? 'top' : 'bottom']: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            [tipPos.above ? 'borderTop' : 'borderBottom']: '6px solid #1E293B',
          }} />
          {matchedFeature && (
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
              {matchedUrl ? (
                <a href={matchedUrl} target="_blank" rel="noopener noreferrer" style={{
                  color: '#60A5FA', textDecoration: 'none', borderBottom: '1px dashed rgba(96,165,250,0.4)',
                }}>
                  {matchedFeature}
                </a>
              ) : matchedFeature}
            </div>
          )}
          {reason && <div style={{ color: '#CBD5E1' }}>{reason}</div>}
        </div>,
        document.body
      )}
    </span>
  );
}

export default function FeatureMatrix({ data, meta }) {
  if (!data || data.length === 0) return null;

  const competitors = meta.competitors || [];

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
                <th style={{ minWidth: 200 }}>Feature</th>
                {competitors.map(c => <th key={c.id} style={{ textAlign: 'center', minWidth: 110 }}>{c.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {(group.features || []).map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    {row.url ? (
                      <a href={row.url} target="_blank" rel="noopener noreferrer" style={{
                        color: 'var(--navy)', textDecoration: 'none', borderBottom: '1px dashed var(--gray-400)',
                      }} title={row.url}>
                        {row.title || (row.feature?.length > 60 ? row.feature.slice(0, 60) + '...' : row.feature)}
                      </a>
                    ) : (
                      row.title || (row.feature?.length > 60 ? row.feature.slice(0, 60) + '...' : row.feature)
                    )}
                  </td>
                  {competitors.map(c => {
                    const comp = row.competitors?.[c.id];
                    return (
                      <td key={c.id} style={{ textAlign: 'center' }}>
                        <ClassBadge
                          classification={comp?.classification || 'none'}
                          reason={comp?.classification !== 'none' ? comp?.reason : null}
                          matchedFeature={comp?.classification !== 'none' ? comp?.matched_feature : null}
                          matchedUrl={comp?.classification !== 'none' ? comp?.matched_url : null}
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
    </div>
  );
}
