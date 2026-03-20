import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Globe, MessageSquare, Bot, ChevronDown, ChevronUp, ExternalLink, Lightbulb, ArrowUpRight, AlertTriangle, Eye } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/* ─── helpers ─── */
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

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

const platformIcons = {
  'ChatGPT': '🤖',
  'Perplexity': '🔍',
  'Gemini': '✨',
  'Google AIO': '🌐',
  'Copilot': '🪟',
  'Claude': '🟠',
};

const positionBadge = (pos) => {
  if (!pos && pos !== 0) return <span style={{ color: 'var(--gray-300)', fontSize: '0.78rem' }}>—</span>;
  const color = pos <= 3 ? '#059669' : pos <= 6 ? '#D97706' : '#DC2626';
  const bg = pos <= 3 ? '#D1FAE5' : pos <= 6 ? '#FEF3C7' : '#FEE2E2';
  return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.78rem', fontWeight: 700, background: bg, color }}>#{pos}</span>;
};

const mentionBadge = (mentioned) => {
  if (mentioned) return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>Yes</span>;
  return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B' }}>No</span>;
};

const sentimentDot = (sentiment) => {
  const colors = { positive: '#059669', neutral: '#6B7280', negative: '#DC2626', mixed: '#D97706' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: colors[sentiment] || '#6B7280', textTransform: 'capitalize' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[sentiment] || '#6B7280', display: 'inline-block' }} />
      {sentiment}
    </span>
  );
};


/* ═══════════════════════════════════════════════════════════════
   SCORECARD
   ═══════════════════════════════════════════════════════════════ */
function Scorecard({ data }) {
  if (!data) return null;
  const stats = [
    { label: 'AI Visibility Score', value: data.visibility_score, accent: '#2563EB' },
    { label: 'Mention Rate', value: data.mention_rate, accent: '#059669' },
    { label: 'Avg Position', value: data.avg_position, accent: '#7C3AED' },
    { label: 'Queries Tracked', value: data.queries_tracked, accent: '#D97706' },
    { label: 'Top Engine', value: data.top_engine, accent: '#0891B2' },
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
          <div style={{ fontSize: typeof s.value === 'number' ? '1.4rem' : '0.9rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>
            {s.value ?? '—'}
          </div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   PLATFORM BREAKDOWN — per-engine visibility
   Gaurav: tracks across ChatGPT, Gemini, Perplexity [22:46]
   ═══════════════════════════════════════════════════════════════ */
function PlatformBreakdown({ platforms }) {
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Platform Breakdown</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Your AI visibility across each engine</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {platforms.map((p, i) => {
          const tc = trendColor(p.trend);
          return (
            <div key={i} style={{
              border: '1px solid var(--gray-200)', borderRadius: 8, padding: 16, textAlign: 'center',
              borderTop: `3px solid ${tc.border}`,
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{platformIcons[p.name] || '🤖'}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)', marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 2 }}>{p.visibility}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginBottom: 8 }}>visibility</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--gray-700)' }}>{p.mentions}</div>
                  <div>mentions</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--gray-700)' }}>{p.avg_position ? `#${Math.round(p.avg_position)}` : '—'}</div>
                  <div>avg pos</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, background: tc.bg, color: tc.color, textTransform: 'capitalize' }}>
                  {trendIcon(p.trend)} {p.trend}
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
   SHARE OF VOICE — competitor comparison
   Pattern: Otterly's competitor overlay + Profound's SOV
   ═══════════════════════════════════════════════════════════════ */
function ShareOfVoice({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  const maxMentionRate = Math.max(...competitors.map(c => c.mention_rate || 0), 1);
  const sorted = [...competitors].sort((a, b) => (b.mention_rate || 0) - (a.mention_rate || 0));

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Share of Voice in AI Search</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>How often each company is mentioned across all AI engines for tracked queries</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 80 }}>Mention Rate</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '40%' }}></th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 80 }}>Avg Position</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((comp, i) => {
              const barW = (comp.mention_rate / maxMentionRate) * 100;
              const isYou = comp.is_you;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isYou ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                      <span style={{ fontWeight: isYou ? 700 : 600, color: 'var(--navy)' }}>
                        {comp.name}
                      </span>
                      {isYou && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>{comp.mention_rate}%</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ height: 10, borderRadius: 5, background: 'var(--gray-100)', overflow: 'hidden' }}>
                      <div style={{ width: `${barW}%`, height: '100%', borderRadius: 5, background: isYou ? '#C9A84C' : '#93B5E8', transition: 'width 0.3s' }} />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: 'var(--gray-600)', fontWeight: 500 }}>#{comp.avg_position ? Math.round(comp.avg_position) : '—'}</td>
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
   VISIBILITY TREND — simple table with horizontal bars
   Same pattern as PublishingCadence / TrafficOverview
   ═══════════════════════════════════════════════════════════════ */
function VisibilityTrend({ trend }) {
  const [period, setPeriod] = useState('90d');

  if (!trend) return null;

  const data = trend[period] || [];
  if (data.length === 0) return null;

  const maxVal = 100; // visibility is 0-100%
  // Show most recent first (descending chronological order)
  const reversed = [...data].reverse();
  const lastVal = data[data.length - 1].value; // most recent
  const firstVal = data[0].value; // oldest
  const change = lastVal - firstVal;
  const changePct = firstVal > 0 ? ((change / firstVal) * 100).toFixed(0) : '—';

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 className="section-title" style={{ margin: 0 }}>AI Visibility Trend</h3>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
            background: change >= 0 ? '#D1FAE5' : '#FEE2E2',
            color: change >= 0 ? '#065F46' : '#991B1B',
          }}>
            {change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {change >= 0 ? '+' : ''}{change} pts ({change >= 0 ? '+' : ''}{changePct}%)
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['30d', '90d', '180d'].map(p => (
            <button key={p} className="btn-secondary" onClick={() => setPeriod(p)} style={{
              padding: '4px 10px', fontSize: '0.7rem',
              fontWeight: period === p ? 700 : 400,
              background: period === p ? 'var(--navy)' : undefined,
              color: period === p ? '#fff' : undefined,
              borderColor: period === p ? 'var(--navy)' : undefined,
            }}>
              {p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '180 Days'}
            </button>
          ))}
        </div>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        Your visibility score over time — {firstVal}% to {lastVal}%
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {reversed.map((d, i) => {
          const barW = (d.value / maxVal) * 100;
          const next = i < reversed.length - 1 ? reversed[i + 1].value : null;
          const diff = next !== null ? d.value - next : null;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 24 }}>
              <div style={{ minWidth: 60, textAlign: 'right', fontSize: '0.78rem', fontWeight: 500, color: 'var(--gray-500)' }}>
                {d.label}
              </div>
              <div style={{ flex: 1, height: 20, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${barW}%`, height: '100%', borderRadius: 4,
                  background: '#2563EB', opacity: 0.7,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                  minWidth: d.value > 0 ? 36 : 0, transition: 'width 0.3s',
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>{d.value}%</span>
                </div>
              </div>
              <div style={{ minWidth: 40, textAlign: 'right' }}>
                {diff !== null && diff !== 0 && (
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    color: diff > 0 ? '#059669' : '#DC2626',
                  }}>
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   QUERY TRACKER — per-query, per-platform table
   Core Otterly pattern: row per query, columns per engine
   Gaurav: tracks ~100 queries across engines [interview]
   ═══════════════════════════════════════════════════════════════ */
function QueryTracker({ queries, engines }) {
  const [expandedQuery, setExpandedQuery] = useState(null);

  if (!queries || queries.length === 0) return null;

  const allEngines = engines || ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Query Tracker</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Per-query visibility — who appears where across AI engines</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 220 }}>Query</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 60 }}>You</th>
              {allEngines.map(e => (
                <th key={e} style={{ textAlign: 'center', padding: '10px 8px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', minWidth: 80 }}>
                  {platformIcons[e] || ''} {e}
                </th>
              ))}
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 70 }}>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q, i) => {
              const isOpen = expandedQuery === i;
              const youMentioned = Object.values(q.engines || {}).some(e => e.you_mentioned);
              return (
                <>
                  <tr key={i}
                    onClick={() => setExpandedQuery(isOpen ? null : i)}
                    style={{
                      borderBottom: isOpen ? 'none' : '1px solid var(--gray-100)',
                      cursor: 'pointer',
                      background: !youMentioned ? '#FFF8F8' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{q.query}</div>
                      {q.intent && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 3, background: 'var(--gray-100)', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{q.intent}</span>}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      {youMentioned
                        ? <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>Yes</span>
                        : <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#DC2626' }}>No</span>
                      }
                    </td>
                    {allEngines.map(e => {
                      const eng = q.engines?.[e];
                      return (
                        <td key={e} style={{ textAlign: 'center', padding: '12px' }}>
                          {eng?.you_position ? positionBadge(eng.you_position) : (
                            eng?.you_mentioned ? mentionBadge(true) : <span style={{ color: 'var(--gray-300)' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      {q.sentiment ? sentimentDot(q.sentiment) : <span style={{ color: 'var(--gray-300)' }}>—</span>}
                    </td>
                  </tr>
                  {/* Expanded: show who else appears */}
                  {isOpen && (
                    <tr key={`${i}-detail`} style={{ borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                      <td colSpan={allEngines.length + 3} style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8 }}>Competitors mentioned in this query</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {q.competitors_in_answer?.map((c, ci) => (
                            <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                              <CompanyLogo name={c.name} logoUrl={null} size={16} />
                              <span style={{ fontWeight: 600, color: 'var(--navy)', minWidth: 100 }}>{c.name}</span>
                              <span style={{ color: 'var(--gray-500)' }}>Mentioned in: {c.engines?.join(', ')}</span>
                              {c.position && <span style={{ marginLeft: 'auto' }}>{positionBadge(c.position)}</span>}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   TOP CITED PAGES — which URLs AI engines reference
   ═══════════════════════════════════════════════════════════════ */
function TopCitedPages({ pages, logoMap }) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Top Cited Pages</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Pages most frequently cited as sources by AI engines</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Page</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Citations</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Engines</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, i) => {
              const isYou = page.is_you;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isYou ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CompanyLogo name={page.company} logoUrl={logoMap[page.company]} size={18} />
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{page.company}</span>
                      {isYou && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--navy)', fontSize: '0.82rem' }}>{page.title}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>{page.path}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: 'var(--navy)' }}>{page.citations}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                      {page.engines?.map((e, ei) => (
                        <span key={ei} style={{ fontSize: '0.9rem' }} title={e}>{platformIcons[e] || '🤖'}</span>
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
   AI VISIBILITY GAPS — white cards, colored left border
   Matches "What To Do Next" card style
   ═══════════════════════════════════════════════════════════════ */
function VisibilityGaps({ gaps, logoMap }) {
  const [expandedGap, setExpandedGap] = useState({});

  if (!gaps || gaps.length === 0) return null;

  const sevColors = {
    critical: { border: '#DC2626', text: '#991B1B', badge: '#DC2626' },
    high: { border: '#D97706', text: '#92400E', badge: '#D97706' },
    medium: { border: '#2563EB', text: '#1E40AF', badge: '#2563EB' },
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>AI Visibility Gaps</h3>
        <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
          {gaps.length} gaps found
        </span>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 20 }}>Queries where competitors appear in AI answers but you don't</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {gaps.map((gap, i) => {
          const sc = sevColors[gap.severity] || sevColors.medium;
          const isOpen = expandedGap[i];
          return (
            <div key={i} style={{
              borderRadius: 8, border: '1px solid var(--gray-200)', borderLeft: `4px solid ${sc.border}`,
              background: '#fff', padding: '16px 18px',
            }}>
              {/* Top: severity + query */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: sc.badge, color: '#fff', textTransform: 'uppercase' }}>{gap.severity}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Search Gap</span>
              </div>

              {/* Query as headline */}
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: sc.text, lineHeight: 1.4, marginBottom: 10 }}>
                "{gap.query}"
              </div>

              {/* Competitors appearing — inline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600 }}>Competitors appearing:</span>
                {gap.competitors?.map((c, ci) => (
                  <span key={ci} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'var(--gray-100)', fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={14} />
                    {c.name}
                    <span style={{ color: 'var(--gray-400)' }}>({c.engines?.length} engines)</span>
                  </span>
                ))}
              </div>

              {/* Expandable detail */}
              <div
                onClick={() => setExpandedGap(prev => ({ ...prev, [i]: !prev[i] }))}
                style={{
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.72rem', fontWeight: 600, color: sc.text, opacity: 0.7,
                }}
              >
                {isOpen ? 'Hide details' : 'Show details & recommendation'}
                {isOpen ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              </div>

              {isOpen && (
                <div style={{ marginTop: 10 }}>
                  {/* Engine detail per competitor */}
                  <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 6, background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                    {gap.competitors?.map((c, ci) => (
                      <div key={ci} style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginBottom: ci < gap.competitors.length - 1 ? 4 : 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={14} />
                        <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{c.name}</span>
                        <span style={{ color: 'var(--gray-400)' }}>→</span>
                        <span>{c.engines?.join(', ')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  {gap.recommendation && (
                    <div style={{ padding: '10px 14px', borderRadius: 6, background: '#FFFBF0', border: '1px solid #FDE68A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
                        <Lightbulb size={13} /> Recommendation
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#92400E', lineHeight: 1.5 }}>{gap.recommendation}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   WHAT TO DO NEXT — matches Traffic & SEO pattern
   Numbered priority cards + "Also Consider" section
   ═══════════════════════════════════════════════════════════════ */
function Recommendations({ insights }) {
  const [expandedIdx, setExpandedIdx] = useState({});

  if (!insights || insights.length === 0) return null;

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...insights].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  const highPriority = sorted.filter(i => i.priority === 'critical' || i.priority === 'high');
  const otherPriority = sorted.filter(i => i.priority !== 'critical' && i.priority !== 'high');

  const sevColors = {
    critical: { border: '#DC2626', text: '#991B1B', badge: '#DC2626' },
    high: { border: '#D97706', text: '#92400E', badge: '#D97706' },
    medium: { border: '#2563EB', text: '#1E40AF', badge: '#2563EB' },
    low: { border: '#9CA3AF', text: '#374151', badge: '#9CA3AF' },
  };

  const catStyle = (cat) => ({
    padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700,
    background: cat === 'aeo' ? '#F3E8FF' : '#DBEAFE',
    color: cat === 'aeo' ? '#6B21A8' : '#1E40AF',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  });

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>What To Do Next</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
            {highPriority.length} Priority
          </span>
          {otherPriority.length > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-500)', border: '1px solid var(--gray-200)' }}>
              {otherPriority.length} Also Consider
            </span>
          )}
        </div>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 20 }}>
        Actionable recommendations to improve your AI search visibility
      </p>

      {/* High priority — numbered action cards */}
      {highPriority.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: otherPriority.length > 0 ? 24 : 0 }}>
          {highPriority.map((ins, i) => {
            const isOpen = expandedIdx[`h${i}`];
            const sc = sevColors[ins.priority] || sevColors.high;
            return (
              <div key={`h${i}`} style={{
                borderRadius: 8, border: '1px solid var(--gray-200)', borderLeft: `4px solid ${sc.border}`,
                background: '#fff', padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    minWidth: 24, height: 24, borderRadius: '50%',
                    background: sc.badge, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: sc.badge, color: '#fff', textTransform: 'uppercase' }}>{ins.priority}</span>
                  {ins.category && <span style={catStyle(ins.category)}>{ins.category}</span>}
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ins.type}</span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: sc.text, lineHeight: 1.4, marginBottom: 8 }}>
                  {ins.action}
                </div>

                <div style={{ fontSize: '0.8rem', color: sc.text, opacity: 0.85, lineHeight: 1.5 }}>
                  {ins.observation}
                </div>

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
                    {ins.implication}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Also Consider */}
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
            {otherPriority.map((ins, i) => {
              const isOpen = expandedIdx[`o${i}`];
              return (
                <div key={`o${i}`} style={{
                  display: 'flex', gap: 14, padding: '14px 16px',
                  borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--gray-50)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ minWidth: 80, paddingTop: 2 }}>
                    {ins.category && <div style={{ marginBottom: 4 }}><span style={catStyle(ins.category)}>{ins.category}</span></div>}
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {ins.type}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>
                      {ins.action}
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
                        <div style={{ marginBottom: 4 }}>{ins.observation}</div>
                        <div style={{ fontStyle: 'italic', color: 'var(--gray-500)' }}>{ins.implication}</div>
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
   MAIN COMPONENT — V1 with sub-tabs
   Tab 1: Visibility Overview (how visible are you across AI engines)
   Tab 2: Queries & Citations (per-query tracking + gaps)
   ═══════════════════════════════════════════════════════════════ */
export default function AEOIntel({ data, meta }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  const tabs = [
    { key: 'overview', label: 'Visibility Overview', icon: <Eye size={15} /> },
    { key: 'queries', label: 'Queries & Citations', icon: <Search size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        padding: 4, background: 'var(--gray-100)', borderRadius: 10, width: 'fit-content',
      }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === tab.key ? 'var(--white)' : 'transparent',
            boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            color: activeTab === tab.key ? 'var(--navy)' : 'var(--gray-500)',
            fontWeight: activeTab === tab.key ? 700 : 500,
            fontSize: '0.85rem', transition: 'all 0.15s',
          }}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <Scorecard data={data.scorecard} />
          <PlatformBreakdown platforms={data.platforms} />
          <ShareOfVoice competitors={data.share_of_voice} logoMap={logoMap} />
          <VisibilityTrend trend={data.visibility_trend} />
        </>
      )}

      {activeTab === 'queries' && (
        <>
          <QueryTracker queries={data.queries} engines={data.tracked_engines} />
          <TopCitedPages pages={data.top_cited_pages} logoMap={logoMap} />
          <VisibilityGaps gaps={data.visibility_gaps} logoMap={logoMap} />
          <Recommendations insights={data.recommendations} />
        </>
      )}
    </div>
  );
}
