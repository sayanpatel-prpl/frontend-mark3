import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Lightbulb, Globe, Search, ArrowUpRight, ArrowDownRight, BarChart3, Link2 } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/* ─── helpers ─── */
const fmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const fmtDollar = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
};

const trendIcon = (trend) => {
  if (!trend) return null;
  const t = trend.toLowerCase();
  if (t === 'up' || t === 'growing' || t === 'accelerating') return <TrendingUp size={14} style={{ color: '#059669' }} />;
  if (t === 'down' || t === 'declining' || t === 'slowing') return <TrendingDown size={14} style={{ color: '#DC2626' }} />;
  return <Minus size={14} style={{ color: '#6B7280' }} />;
};

const trendColor = (trend) => {
  if (!trend) return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
  const t = trend.toLowerCase();
  if (t === 'up' || t === 'growing' || t === 'accelerating') return { bg: '#D1FAE5', color: '#065F46', border: '#059669' };
  if (t === 'down' || t === 'declining' || t === 'slowing') return { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' };
  return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
};

const severityColors = {
  critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', badge: '#DC2626' },
  high: { bg: '#FEF3C7', border: '#D97706', text: '#92400E', badge: '#D97706' },
  medium: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF', badge: '#2563EB' },
  low: { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151', badge: '#9CA3AF' },
};

const channelColors = {
  'Organic Search': '#059669',
  'Paid Search': '#2563EB',
  'Direct': '#6B7280',
  'Referral': '#7C3AED',
  'Social': '#D97706',
  'Email': '#DC2626',
  'Display': '#0891B2',
};

const intentColors = {
  informational: { bg: '#DBEAFE', color: '#1E40AF' },
  commercial: { bg: '#FEF3C7', color: '#92400E' },
  navigational: { bg: '#F3F4F6', color: '#374151' },
  transactional: { bg: '#D1FAE5', color: '#065F46' },
};


/* ═══════════════════════════════════════════════════════════════
   1. SCORECARD — key metrics at a glance
   ═══════════════════════════════════════════════════════════════ */
function Scorecard({ data }) {
  if (!data) return null;
  const stats = [
    { label: 'Your Organic Traffic', value: data.your_organic_traffic, format: fmt, accent: '#059669' },
    { label: 'Domain Authority', value: data.your_da, accent: '#2563EB' },
    { label: 'Keywords Ranking', value: data.your_keywords, format: fmt, accent: '#7C3AED' },
    { label: 'Traffic Value', value: data.your_traffic_value, format: fmtDollar, accent: '#D97706' },
    { label: 'Keyword Gaps', value: data.keyword_gaps, accent: '#DC2626' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '16px 16px 14px', borderRadius: 8,
          border: '1px solid var(--gray-200)', borderTop: `3px solid ${s.accent}`,
          background: '#fff',
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray-400)', marginBottom: 8, lineHeight: 1.3 }}>
            {s.label}
          </div>
          <div style={{
            fontSize: typeof s.value === 'number' && s.format ? '1.4rem' : '0.9rem',
            fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2,
          }}>
            {s.format && typeof s.value === 'number' ? s.format(s.value) : (s.value ?? '—')}
          </div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   2. TRAFFIC OVERVIEW — monthly traffic comparison
   Garima: "traffic, how's their traffic?"
   ═══════════════════════════════════════════════════════════════ */
function TrafficOverview({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  const maxTraffic = Math.max(...competitors.map(c => c.monthly_traffic || 0), 1);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Traffic Overview</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Estimated monthly organic traffic — who owns the most search real estate?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {competitors.map((comp) => {
          const barW = (comp.monthly_traffic / maxTraffic) * 100;
          const tc = trendColor(comp.trend);
          const isYou = comp.is_you;
          return (
            <div key={comp.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 140, justifyContent: 'flex-end' }}>
                <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                {isYou && <span style={{ padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
              </div>
              <div style={{ flex: 1, height: 28, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${barW}%`, height: '100%', borderRadius: 4,
                  background: isYou ? '#C9A84C' : '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                  minWidth: comp.monthly_traffic > 0 ? 50 : 0, transition: 'width 0.3s',
                  opacity: isYou ? 1 : 0.7,
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>~{fmt(comp.monthly_traffic)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 100 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 4,
                  fontSize: '0.65rem', fontWeight: 700, background: tc.bg, color: tc.color, textTransform: 'capitalize',
                }}>
                  {trendIcon(comp.trend)} {comp.change_pct != null ? `${comp.change_pct > 0 ? '+' : ''}${comp.change_pct}%` : comp.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   3. DOMAIN AUTHORITY & BACKLINKS
   Garima: "DA domain authority of the website"
   ═══════════════════════════════════════════════════════════════ */
function DomainAuthorityBacklinks({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Domain Authority & Backlinks</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Authority scores and link profiles — the foundation of organic rankings</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>DA Score</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '20%' }}></th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Referring Domains</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Total Backlinks</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>New (30d)</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Velocity</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((comp, i) => {
              const isYou = comp.is_you;
              const daPercent = (comp.da / 100) * 100;
              const tc = trendColor(comp.velocity_trend);
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isYou ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={22} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                          {isYou && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                        </div>
                        {comp.domain && <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>{comp.domain}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '14px 12px', fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy)' }}>{comp.da}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--gray-100)', overflow: 'hidden' }}>
                      <div style={{ width: `${daPercent}%`, height: '100%', borderRadius: 4, background: isYou ? '#C9A84C' : '#2563EB', opacity: 0.7 }} />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--gray-600)' }}>{fmt(comp.referring_domains)}</td>
                  <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--gray-600)' }}>{fmt(comp.total_backlinks)}</td>
                  <td style={{ textAlign: 'center', padding: '14px 12px' }}>
                    <span style={{ fontWeight: 600, color: comp.new_backlinks_30d > 0 ? '#059669' : 'var(--gray-400)' }}>
                      {comp.new_backlinks_30d > 0 ? `+${fmt(comp.new_backlinks_30d)}` : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '14px 12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4,
                      fontSize: '0.7rem', fontWeight: 600, background: tc.bg, color: tc.color,
                    }}>
                      {trendIcon(comp.velocity_trend)} {comp.velocity_trend}
                    </span>
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


/* ═══════════════════════════════════════════════════════════════
   4. KEYWORD RANKINGS — who ranks for what
   Gaurav: keyword tracking; Garima: "who's ranking for certain keywords"
   ═══════════════════════════════════════════════════════════════ */
function KeywordRankings({ keywords, logoMap }) {
  const [filter, setFilter] = useState('all');
  if (!keywords || keywords.length === 0) return null;

  const intents = ['all', ...new Set(keywords.map(k => k.intent).filter(Boolean))];
  const filtered = filter === 'all' ? keywords : keywords.filter(k => k.intent === filter);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Keyword Rankings Comparison</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 12 }}>Top organic keywords — who ranks where, and for what intent</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {intents.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === t ? 'var(--azure)' : 'var(--gray-200)',
            background: filter === t ? 'var(--azure)' : 'transparent',
            color: filter === t ? '#fff' : 'var(--gray-600)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t === 'all' ? 'All Intents' : t}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keyword</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Volume</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Intent</th>
              {filtered[0]?.rankings?.map((r, i) => (
                <th key={i} style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 90 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <CompanyLogo name={r.name} logoUrl={logoMap[r.name]} size={14} />
                    <span>{r.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((kw, ki) => {
              const ic = intentColors[kw.intent] || intentColors.informational;
              return (
                <tr key={ki} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--navy)', maxWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Search size={12} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                      {kw.keyword}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-600)' }}>{fmt(kw.volume)}</td>
                  <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, background: ic.bg, color: ic.color, textTransform: 'capitalize' }}>
                      {kw.intent}
                    </span>
                  </td>
                  {kw.rankings?.map((r, ri) => {
                    const pos = r.position;
                    const posColor = pos <= 3 ? '#059669' : pos <= 10 ? '#2563EB' : pos <= 20 ? '#D97706' : '#DC2626';
                    const changeColor = r.change > 0 ? '#059669' : r.change < 0 ? '#DC2626' : 'var(--gray-400)';
                    return (
                      <td key={ri} style={{ textAlign: 'center', padding: '10px 12px' }}>
                        {pos ? (
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: posColor }}>#{pos}</span>
                            {r.change != null && r.change !== 0 && (
                              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: changeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                {r.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {Math.abs(r.change)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--gray-300)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   5. KEYWORD GAP ANALYSIS — table format
   Garima: "content gap analysis in organic"
   Ahrefs Content Gap / SpyFu Kombat pattern
   ═══════════════════════════════════════════════════════════════ */
function KeywordGaps({ gaps, logoMap }) {
  if (!gaps || gaps.length === 0) return null;

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...gaps].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Keyword Gaps</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Keywords your competitors rank for that you don't — sorted by opportunity</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keyword</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Priority</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Volume</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>CPC</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Difficulty</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Who Ranks</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((gap, i) => {
              const sc = severityColors[gap.priority] || severityColors.medium;
              const diffColor = gap.difficulty <= 35 ? '#059669' : gap.difficulty <= 55 ? '#D97706' : '#DC2626';
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '12px 12px', fontWeight: 600, color: 'var(--navy)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Search size={12} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                      {gap.keyword}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700,
                      background: sc.badge, color: '#fff', textTransform: 'uppercase',
                    }}>{gap.priority}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 12px', color: 'var(--gray-600)' }}>{fmt(gap.volume)}/mo</td>
                  <td style={{ textAlign: 'center', padding: '12px 12px', color: 'var(--gray-600)' }}>${gap.cpc?.toFixed(2)}</td>
                  <td style={{ textAlign: 'center', padding: '12px 12px' }}>
                    <span style={{ fontWeight: 700, color: diffColor }}>{gap.difficulty}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.7rem' }}>/100</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {gap.competitors_ranking?.map((cr, j) => (
                        <div key={j} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                          borderRadius: 4, background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                          fontSize: '0.72rem',
                        }}>
                          <CompanyLogo name={cr.name} logoUrl={logoMap[cr.name]} size={13} />
                          <span style={{ fontWeight: 500, color: 'var(--gray-600)' }}>{cr.name}</span>
                          <span style={{ fontWeight: 700, color: '#059669' }}>#{cr.position}</span>
                        </div>
                      ))}
                    </div>
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


/* ═══════════════════════════════════════════════════════════════
   6. TOP PAGES — which pages drive most traffic
   SEMrush pattern: most valuable pages by organic traffic
   ═══════════════════════════════════════════════════════════════ */
function TopPages({ pages, logoMap }) {
  if (!pages || pages.length === 0) return null;

  const maxTraffic = Math.max(...pages.map(p => p.traffic || 0), 1);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Top Competitor Pages</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Highest-traffic competitor pages — what content is earning them the most organic visits?</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Page</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Est. Traffic</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '20%' }}></th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keywords</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Top Keyword</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, i) => {
              const barW = (page.traffic / maxTraffic) * 100;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CompanyLogo name={page.company} logoUrl={logoMap[page.company]} size={18} />
                      <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.8rem' }}>{page.company}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', maxWidth: 220 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--navy)', fontWeight: 500 }}>{page.title}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: 2 }}>{page.path}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 12px', fontWeight: 700, color: 'var(--navy)' }}>~{fmt(page.traffic)}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--gray-100)', overflow: 'hidden' }}>
                      <div style={{ width: `${barW}%`, height: '100%', borderRadius: 4, background: '#2563EB', opacity: 0.6 }} />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 12px', color: 'var(--gray-600)' }}>{page.keyword_count}</td>
                  <td style={{ padding: '12px 12px', fontSize: '0.78rem', color: 'var(--gray-600)' }}>{page.top_keyword}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   7. TRAFFIC SOURCE BREAKDOWN — channel distribution
   Gaurav: channel-specific competitors; SimilarWeb pattern
   ═══════════════════════════════════════════════════════════════ */
function TrafficSources({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  const channels = Object.keys(competitors[0]?.channels || {});

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Traffic Source Breakdown</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Marketing channel mix — where does each competitor's traffic come from?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {competitors.map((comp) => {
          const isYou = comp.is_you;
          return (
            <div key={comp.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                {isYou && <span style={{ padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
              </div>
              {/* Stacked bar */}
              <div style={{ display: 'flex', height: 24, borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                {channels.map((ch) => {
                  const pct = comp.channels?.[ch] || 0;
                  if (pct === 0) return null;
                  return (
                    <div key={ch} style={{
                      width: `${pct}%`, height: '100%',
                      background: channelColors[ch] || '#6B7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: pct > 8 ? '0.6rem' : 0, fontWeight: 700, color: '#fff',
                      transition: 'width 0.3s',
                    }}>
                      {pct > 8 ? `${pct}%` : ''}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {channels.map(ch => {
                  const pct = comp.channels?.[ch] || 0;
                  if (pct === 0) return null;
                  return (
                    <div key={ch} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: 'var(--gray-500)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: channelColors[ch] || '#6B7280' }} />
                      {ch}: {pct}%
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   AI STRATEGIC INSIGHTS — action-forward layout
   Theme 2: "Insights > Data Dumps"
   Garima: "recommendations will flip the whole game"
   ═══════════════════════════════════════════════════════════════ */
function StrategicInsights({ insights }) {
  const [expandedIdx, setExpandedIdx] = useState({});
  if (!insights || insights.length === 0) return null;

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...insights].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  const highPriority = sorted.filter(i => i.priority === 'critical' || i.priority === 'high');
  const otherPriority = sorted.filter(i => i.priority !== 'critical' && i.priority !== 'high');

  const catStyle = (cat) => ({
    padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700,
    background: cat === 'traffic' ? '#DBEAFE' : '#F3E8FF',
    color: cat === 'traffic' ? '#1E40AF' : '#6B21A8',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  });

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      {/* Header — consistent with other sections */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>What To Do Next</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700,
            background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA',
          }}>
            {highPriority.length} Priority
          </span>
          {otherPriority.length > 0 && (
            <span style={{
              padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700,
              background: 'var(--gray-100)', color: 'var(--gray-500)', border: '1px solid var(--gray-200)',
            }}>
              {otherPriority.length} Also Consider
            </span>
          )}
        </div>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 20 }}>
        Actionable recommendations based on competitive traffic and SEO data
      </p>

      {/* High priority — numbered action cards, light style */}
      {highPriority.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: otherPriority.length > 0 ? 24 : 0 }}>
          {highPriority.map((insight, i) => {
            const isOpen = expandedIdx[`h${i}`];
            const sc = severityColors[insight.priority] || severityColors.high;
            return (
              <div key={`h${i}`} style={{
                borderRadius: 8, border: `1px solid var(--gray-200)`, borderLeft: `4px solid ${sc.border}`,
                background: '#fff', padding: '16px 18px',
              }}>
                {/* Top row: number + badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    minWidth: 24, height: 24, borderRadius: '50%',
                    background: sc.badge, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700,
                    background: sc.badge, color: '#fff', textTransform: 'uppercase',
                  }}>{insight.priority}</span>
                  {insight.category && <span style={catStyle(insight.category)}>{insight.category}</span>}
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {insight.type}
                  </span>
                </div>

                {/* Action — bold headline */}
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: sc.text, lineHeight: 1.4, marginBottom: 8 }}>
                  {insight.action}
                </div>

                {/* Observation */}
                <div style={{ fontSize: '0.8rem', color: sc.text, opacity: 0.85, lineHeight: 1.5 }}>
                  {insight.observation}
                </div>

                {/* Expandable impact */}
                <div
                  onClick={() => setExpandedIdx(prev => ({ ...prev, [`h${i}`]: !prev[`h${i}`] }))}
                  style={{
                    marginTop: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: '0.72rem', fontWeight: 600, color: sc.text, opacity: 0.7,
                  }}
                >
                  {isOpen ? 'Hide impact analysis' : 'Show impact analysis'}
                  {isOpen ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                </div>
                {isOpen && (
                  <div style={{
                    marginTop: 6, padding: '10px 14px', borderRadius: 6,
                    background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                    fontSize: '0.78rem', color: sc.text, lineHeight: 1.5,
                  }}>
                    {insight.implication}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Other priority — under a clear sub-heading */}
      {otherPriority.length > 0 && (
        <>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--gray-400)', marginBottom: 10, paddingTop: 4,
            borderTop: '1px solid var(--gray-200)',
          }}>
            Also Consider
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {otherPriority.map((insight, i) => {
              const isOpen = expandedIdx[`o${i}`];
              return (
                <div key={`o${i}`} style={{
                  display: 'flex', gap: 14, padding: '14px 16px',
                  borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--gray-50)',
                  alignItems: 'flex-start',
                }}>
                  {/* Left: category + type */}
                  <div style={{ minWidth: 80, paddingTop: 2 }}>
                    {insight.category && <div style={{ marginBottom: 4 }}><span style={catStyle(insight.category)}>{insight.category}</span></div>}
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {insight.type}
                    </div>
                  </div>

                  {/* Right: action + expandable */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>
                      {insight.action}
                    </div>
                    <div
                      onClick={() => setExpandedIdx(prev => ({ ...prev, [`o${i}`]: !prev[`o${i}`] }))}
                      style={{
                        marginTop: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: '0.7rem', fontWeight: 600, color: 'var(--azure)',
                      }}
                    >
                      {isOpen ? 'Less' : 'Why this matters'}
                      {isOpen ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    </div>
                    {isOpen && (
                      <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                        <div style={{ marginBottom: 4 }}>{insight.observation}</div>
                        <div style={{ fontStyle: 'italic', color: 'var(--gray-500)' }}>{insight.implication}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION DIVIDER — visual separator between Traffic and SEO halves
   ═══════════════════════════════════════════════════════════════ */
function SectionDivider({ icon, title, subtitle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '32px 0 20px', padding: '12px 0',
      borderBottom: '2px solid var(--gray-200)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36, borderRadius: 8,
        background: 'var(--azure)', color: '#fff',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function TrafficSEO({ data, meta }) {
  const logoMap = {};
  if (meta?.main_company) logoMap[meta.main_company.name] = meta.main_company.logo_url;
  (meta?.competitors || []).forEach(c => { logoMap[c.name] = c.logo_url; });

  return (
    <div>
      {/* ── TRAFFIC ── */}
      <Scorecard data={data?.scorecard} />
      <SectionDivider
        icon={<BarChart3 size={18} />}
        title="Traffic"
        subtitle="Estimated website traffic, source distribution, and top-performing pages"
      />
      <TrafficOverview competitors={data?.traffic_overview} logoMap={logoMap} />
      <TrafficSources competitors={data?.traffic_sources} logoMap={logoMap} />
      <TopPages pages={data?.top_pages} logoMap={logoMap} />

      {/* ── SEO ── */}
      <SectionDivider
        icon={<Search size={18} />}
        title="SEO"
        subtitle="Domain authority, keyword rankings, backlink profiles, and keyword gaps"
      />
      <DomainAuthorityBacklinks competitors={data?.domain_authority} logoMap={logoMap} />
      <KeywordRankings keywords={data?.keyword_rankings} logoMap={logoMap} />
      <KeywordGaps gaps={data?.keyword_gaps} logoMap={logoMap} />

      {/* ── INSIGHTS ── */}
      <StrategicInsights insights={data?.strategic_insights} />
    </div>
  );
}
