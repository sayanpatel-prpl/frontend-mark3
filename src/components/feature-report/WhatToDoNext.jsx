import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/*
  Shared "What To Do Next" component used across all Marketing Intelligence tabs.

  Props:
    insights: Array of { priority, type, action, observation, implication, category? }
    — OR for Messaging tab —
    counterData: Array of { company, counter_points | counter_strategy }
    logoMap: object
    subtitle: string (optional)
*/

const PRIORITY = {
  critical: { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' },
  high:     { bg: '#FEF3C7', color: '#92400E', border: '#D97706' },
  medium:   { bg: '#DBEAFE', color: '#1E40AF', border: '#2563EB' },
  low:      { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' },
};

export default function WhatToDoNext({ insights, counterData, logoMap, subtitle }) {
  const [openIdx, setOpenIdx] = useState(null);

  // ── MODE 1: Standard insights (Traffic & SEO, Paid, Content, AEO) ──
  if (insights?.length > 0) {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sorted = [...insights].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

    return (
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 className="section-title" style={{ marginBottom: 4 }}>What To Do Next</h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 16 }}>
          {subtitle || 'Actionable recommendations based on competitive data'}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 70 }}>Priority</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 110 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ins, i) => {
                const isOpen = openIdx === i;
                const pc = PRIORITY[ins.priority] || PRIORITY.medium;
                return (
                  <tr key={i}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    style={{ borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', borderLeft: `3px solid ${pc.border}` }}
                  >
                    <td style={{ textAlign: 'center', padding: '12px 8px', verticalAlign: 'top' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700, background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, textTransform: 'uppercase' }}>{ins.priority}</span>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ins.type}</div>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{ins.action}</div>
                        {(ins.observation || ins.implication) && (
                          <span style={{ flexShrink: 0, color: 'var(--gray-400)', marginTop: 2 }}>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        )}
                      </div>
                      {isOpen && (ins.observation || ins.implication) && (
                        <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 6, background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                          {ins.observation && (
                            <div style={{ marginBottom: ins.implication ? 8 : 0 }}>
                              <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)', marginBottom: 3 }}>What we found</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{ins.observation}</div>
                            </div>
                          )}
                          {ins.implication && (
                            <div>
                              <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)', marginBottom: 3 }}>Why it matters</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{ins.implication}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── MODE 2: Counter data (Messaging tab — per-competitor) ──
  if (counterData?.length > 0) {
    const rows = [];
    counterData.forEach(comp => {
      const points = comp.counter_points || (comp.counter_strategy ? [comp.counter_strategy] : []);
      points.forEach((p, pi) => {
        const raw = typeof p === 'string' ? p : p.point || p;
        let point = raw;
        let evidence = typeof p === 'object' ? p.evidence : null;
        if (!evidence && typeof raw === 'string' && raw.includes(' — ')) {
          const parts = raw.split(' — ');
          point = parts[0];
          evidence = parts.slice(1).join(' — ');
        }
        rows.push({ company: comp.company, point, evidence, isFirst: pi === 0 });
      });
    });
    if (rows.length === 0) return null;

    return (
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 className="section-title" style={{ marginBottom: 4 }}>What To Do Next</h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 16 }}>
          {subtitle || 'How to position against each competitor — use in deals, battle cards, and sales calls'}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 130 }}>Against</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Action</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '30%' }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid var(--gray-100)',
                  borderTop: row.isFirst && i > 0 ? '2px solid var(--gray-200)' : 'none',
                }}>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    {row.isFirst && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CompanyLogo name={row.company} logoUrl={logoMap?.[row.company]} size={18} />
                        <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.82rem' }}>{row.company}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.5 }}>{row.point}</div>
                  </td>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    {row.evidence ? (
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.4, fontStyle: 'italic' }}>{row.evidence}</div>
                    ) : (
                      <span style={{ color: 'var(--gray-300)', fontSize: '0.78rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
