import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const signalColors = {
  accelerating: { bg: '#D1FAE5', color: '#065F46', label: 'Accelerating', bar: '#059669' },
  steady: { bg: '#DBEAFE', color: '#1E40AF', label: 'Steady', bar: '#2563EB' },
  slowing: { bg: '#FEF3C7', color: '#92400E', label: 'Slowing', bar: '#D97706' },
  minimal: { bg: '#F3F4F6', color: '#374151', label: 'Minimal', bar: '#9CA3AF' },
};

export default function NewsMomentum({ data, meta }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!data || data.length === 0) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  const goNext = useCallback(() => setActiveIdx(i => (i + 1) % data.length), [data.length]);
  const goPrev = useCallback(() => setActiveIdx(i => (i - 1 + data.length) % data.length), [data.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const activeItem = data[activeIdx];
  const sig = signalColors[activeItem?.momentum_signal] || signalColors.minimal;

  return (
    <div className="card">
      <h3 className="section-title">News & Momentum Tracker</h3>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Recent announcements and strategic momentum signals across competitors
      </p>

      {/* Company tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap',
        padding: '4px', background: 'var(--gray-100)', borderRadius: 8,
      }}>
        {data.map((item, i) => {
          const itemSig = signalColors[item.momentum_signal] || signalColors.minimal;
          const isActive = i === activeIdx;
          return (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: isActive ? 'var(--white)' : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              color: isActive ? 'var(--navy)' : 'var(--gray-500)',
              fontWeight: isActive ? 600 : 400, fontSize: '0.85rem',
              transition: 'all 0.15s',
            }}>
              <CompanyLogo name={item.company} logoUrl={logoMap[item.company]} size={18} />
              {item.company}
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: itemSig.bar, flexShrink: 0,
              }} />
            </button>
          );
        })}
      </div>

      {/* Active company card */}
      {activeItem && (
        <div style={{
          border: '1px solid var(--gray-200)', borderRadius: 8, padding: 24,
          background: 'var(--gray-50)', borderTop: `3px solid ${sig.bar}`,
          position: 'relative',
        }}>
          {/* Nav arrows */}
          <button onClick={goPrev} style={{
            position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gray-200)',
            background: 'var(--white)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}>
            <ChevronLeft size={16} color="var(--gray-600)" />
          </button>
          <button onClick={goNext} style={{
            position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gray-200)',
            background: 'var(--white)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}>
            <ChevronRight size={16} color="var(--gray-600)" />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CompanyLogo name={activeItem.company} logoUrl={logoMap[activeItem.company]} size={28} />
              <strong style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{activeItem.company}</strong>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: sig.bg, color: sig.color,
            }}>{sig.label}</span>
          </div>

          {activeItem.highlights?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--gray-500)', marginBottom: 8,
              }}>Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activeItem.highlights.map((h, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 0',
                    borderBottom: j < activeItem.highlights.length - 1 ? '1px solid var(--gray-200)' : 'none',
                  }}>
                    <span style={{
                      flexShrink: 0, width: 8, height: 8, borderRadius: '50%',
                      background: sig.bar, marginTop: 6,
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            fontSize: '0.85rem', color: 'var(--gray-600)',
            padding: '12px 16px', background: 'var(--white)', borderRadius: 6,
            borderLeft: `3px solid ${sig.bar}`, lineHeight: 1.6,
          }}>
            {activeItem.summary}
          </div>

          {/* Pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            {data.map((_, i) => (
              <span key={i} onClick={() => setActiveIdx(i)} style={{
                width: i === activeIdx ? 20 : 8, height: 8, borderRadius: 4,
                background: i === activeIdx ? sig.bar : 'var(--gray-300)',
                cursor: 'pointer', transition: 'all 0.2s',
              }} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
