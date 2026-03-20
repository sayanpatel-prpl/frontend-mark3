import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Lightbulb, AlertTriangle, BarChart3, FileText, Video, BookOpen, Mic, FileSpreadsheet, Newspaper, ChevronDown, ChevronUp, ArrowUpRight, Target, Layers, Search, Globe, Database } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/* ─── helpers ─── */
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const trendIcon = (trend) => {
  if (!trend) return null;
  const t = trend.toLowerCase();
  if (t === 'accelerating' || t === 'up') return <TrendingUp size={14} style={{ color: '#059669' }} />;
  if (t === 'slowing' || t === 'down') return <TrendingDown size={14} style={{ color: '#DC2626' }} />;
  return <Minus size={14} style={{ color: '#6B7280' }} />;
};

const trendColor = (trend) => {
  if (!trend) return {};
  const t = trend.toLowerCase();
  if (t === 'accelerating' || t === 'up') return { bg: '#D1FAE5', color: '#065F46', border: '#059669' };
  if (t === 'slowing' || t === 'down') return { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' };
  return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
};

const severityColors = {
  critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', badge: '#DC2626' },
  high: { bg: '#FEF3C7', border: '#D97706', text: '#92400E', badge: '#D97706' },
  medium: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF', badge: '#2563EB' },
  low: { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151', badge: '#9CA3AF' },
};

const contentTypeIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('blog')) return <FileText size={13} />;
  if (t.includes('video') || t.includes('webinar')) return <Video size={13} />;
  if (t.includes('case study') || t.includes('casestudy')) return <BookOpen size={13} />;
  if (t.includes('podcast')) return <Mic size={13} />;
  if (t.includes('whitepaper') || t.includes('white paper') || t.includes('ebook')) return <FileSpreadsheet size={13} />;
  if (t.includes('press') || t.includes('release') || t.includes('news')) return <Newspaper size={13} />;
  return <FileText size={13} />;
};

const contentTypeColor = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('blog')) return '#2563EB';
  if (t.includes('video') || t.includes('webinar')) return '#DC2626';
  if (t.includes('case study')) return '#7C3AED';
  if (t.includes('podcast')) return '#D97706';
  if (t.includes('whitepaper') || t.includes('ebook')) return '#059669';
  if (t.includes('press') || t.includes('release')) return '#0891B2';
  return '#6B7280';
};

const sectionLabel = (color = 'var(--azure)') => ({
  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.06em', color, marginBottom: 8,
});


/* ═══════════════════════════════════════════════════════════════
   SCORECARD — visible cards with solid borders and accent top
   ═══════════════════════════════════════════════════════════════ */
function Scorecard({ data }) {
  if (!data) return null;
  const stats = [
    { label: 'Content Tracked (30d)', value: data.total_content_30d, accent: '#2563EB' },
    { label: 'Your Rate vs Avg', value: data.your_rate_vs_avg, accent: '#D97706' },
    { label: 'Content Gaps Found', value: data.gaps_found, accent: '#DC2626' },
    { label: 'Top Trending Theme', value: data.top_trending_theme, accent: '#059669' },
    { label: 'Most Active Competitor', value: data.most_active_competitor, accent: '#7C3AED' },
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
            fontSize: typeof s.value === 'number' ? '1.4rem' : '0.9rem',
            fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2,
          }}>
            {s.value ?? '—'}
          </div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   CONTENT INVENTORY — focused table (no format breakdown)
   ═══════════════════════════════════════════════════════════════ */
function ContentInventory({ inventory, logoMap }) {
  if (!inventory || inventory.length === 0) return null;

  const maxPages = Math.max(...inventory.map(c => c.total_pages || 0), 1);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Inventory</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Total content footprint — how big is each competitor's content operation?</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 100 }}>Total Pages</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '35%' }}></th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 60 }}>DA</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 110 }}>Est. Traffic</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((comp, i) => {
              const isYou = comp.is_you;
              const barWidth = (comp.total_pages / maxPages) * 100;
              return (
                <tr key={i} style={{
                  borderBottom: '1px solid var(--gray-100)',
                  background: isYou ? '#FFFBF0' : 'transparent',
                }}>
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
                  <td style={{ textAlign: 'center', padding: '14px 12px', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>{fmt(comp.total_pages)}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--gray-100)', overflow: 'hidden' }}>
                      <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: 4, background: isYou ? 'var(--azure)' : '#2563EB', opacity: 0.7, transition: 'width 0.3s' }} />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--gray-600)', fontWeight: 500 }}>{comp.domain_authority || '—'}</td>
                  <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--gray-600)' }}>{comp.est_monthly_traffic ? `~${fmt(comp.est_monthly_traffic)}` : '—'}</td>
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
   CONTENT MIX — clean table with count + percentage + horizontal bar
   ═══════════════════════════════════════════════════════════════ */
function ContentMixComparison({ competitors, inventory, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  const allTypes = [...new Set(competitors.flatMap(c => Object.keys(c.content_mix || {})))];
  const maxPercent = 70;

  // Build a lookup: company name → total_pages from inventory
  const pagesMap = {};
  (inventory || []).forEach(c => { pagesMap[c.name] = c.total_pages; });

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Mix Comparison</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Format distribution — which content types each competitor invests in</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 110 }}>Format</th>
              {competitors.map((comp, i) => {
                const totalPages = pagesMap[comp.name];
                return (
                  <th key={i} style={{ textAlign: 'left', padding: '10px 12px', minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={16} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.78rem' }}>{comp.name}</div>
                        {totalPages && <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)' }}>{fmt(totalPages)} pages</div>}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {allTypes.map((type, ti) => (
              <tr key={ti} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--gray-700)', textTransform: 'capitalize' }}>{type}</td>
                {competitors.map((comp, ci) => {
                  const pct = comp.content_mix?.[type] || 0;
                  const totalPages = pagesMap[comp.name] || 0;
                  const count = totalPages ? Math.round((pct / 100) * totalPages) : null;
                  const isGap = pct === 0;
                  const barW = Math.min((pct / maxPercent) * 100, 100);
                  return (
                    <td key={ci} style={{ padding: '8px 12px' }}>
                      {isGap ? (
                        <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>Not used</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ minWidth: 52 }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>{pct}%</span>
                            {count !== null && <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginLeft: 3 }}>({count})</span>}
                          </div>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--gray-100)', overflow: 'hidden', maxWidth: 80 }}>
                            <div style={{ width: `${barW}%`, height: '100%', borderRadius: 4, background: contentTypeColor(type), opacity: 0.75 }} />
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   PUBLISHING CADENCE — with period selector (30d / 90d / 180d)
   Pattern from QuarterlyTrendChart in review intelligence
   ═══════════════════════════════════════════════════════════════ */
function PublishingCadence({ competitors, logoMap }) {
  const [period, setPeriod] = useState('30d');

  if (!competitors || competitors.length === 0) return null;

  const periodLabel = { '30d': 'Last 30 Days', '90d': 'Last 90 Days', '180d': 'Last 180 Days' };
  const periodKey = { '30d': 'posts_30d', '90d': 'posts_90d', '180d': 'posts_180d' };
  const sorted = [...competitors].sort((a, b) => (b[periodKey[period]] || 0) - (a[periodKey[period]] || 0));
  const maxPosts = Math.max(...sorted.map(c => c[periodKey[period]] || 0), 1);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
        <h3 className="section-title" style={{ margin: 0 }}>Publishing Cadence</h3>
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
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 16 }}>Content pieces published — {periodLabel[period]}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((comp) => {
          const count = comp[periodKey[period]] || 0;
          const tc = trendColor(comp.trend);
          const barW = (count / maxPosts) * 100;
          return (
            <div key={comp.name} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 130, justifyContent: 'flex-end' }}>
                <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={18} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', textAlign: 'right' }}>{comp.name}</span>
              </div>
              <div style={{ flex: 1, height: 24, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${barW}%`, height: '100%', borderRadius: 4,
                  background: tc.border || '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                  minWidth: count > 0 ? 36 : 0, transition: 'width 0.3s',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{count}</span>
                </div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 4,
                fontSize: '0.65rem', fontWeight: 700, background: tc.bg, color: tc.color, textTransform: 'capitalize', minWidth: 80,
              }}>
                {trendIcon(comp.trend)} {comp.trend}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   ACTIVITY FEED — newsletter-style headlines
   ═══════════════════════════════════════════════════════════════ */
function ActivityHeadlines({ items, logoMap }) {
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all');

  if (!items || items.length === 0) return null;

  const contentTypes = ['all', ...new Set(items.map(i => i.content_type).filter(Boolean))];
  const filtered = filter === 'all' ? items : items.filter(i => i.content_type === filter);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 className="section-title" style={{ marginBottom: 4 }}>Content Activity Feed</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', margin: 0 }}>Latest competitor content — skim headlines, expand for details</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {contentTypes.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === t ? 'var(--azure)' : 'var(--gray-200)',
            background: filter === t ? 'var(--azure)' : 'transparent',
            color: filter === t ? '#fff' : 'var(--gray-600)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((item, i) => {
          const isOpen = expanded[i];
          const typeColor = contentTypeColor(item.content_type);
          return (
            <div key={i} style={{
              border: '1px solid var(--gray-200)', borderRadius: 8, padding: '14px 18px',
              background: item.notable ? '#FFFBEB' : 'var(--gray-50)',
              borderLeft: item.notable ? '3px solid #D97706' : '3px solid var(--gray-200)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
              onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CompanyLogo name={item.company} logoUrl={logoMap[item.company]} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{item.title}</span>
                    {item.notable && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase', flexShrink: 0 }}>Notable</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: 'var(--gray-400)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-600)' }}>{item.company}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: typeColor }}>{contentTypeIcon(item.content_type)} {item.content_type}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    {item.topics?.map((t, ti) => (
                      <span key={ti} style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, background: 'var(--gray-200)', color: 'var(--gray-600)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: 'var(--gray-400)' }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gray-200)' }}>
                  {item.summary && <p style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: '0 0 10px' }}>{item.summary}</p>}
                  {item.key_takeaway && (
                    <div style={{ padding: '8px 12px', borderRadius: 6, background: '#EBF5FF', border: '1px solid #BFDBFE', fontSize: '0.82rem', color: '#1E40AF', lineHeight: 1.5 }}>
                      <strong>Key takeaway:</strong> {item.key_takeaway}
                    </div>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.78rem', color: 'var(--azure)', textDecoration: 'none', fontWeight: 600 }}
                      onClick={e => e.stopPropagation()}>
                      View source <ExternalLink size={12} />
                    </a>
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
   THEME CLUSTERS
   ═══════════════════════════════════════════════════════════════ */
function ThemeClusters({ clusters, logoMap }) {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!clusters || clusters.length === 0) return null;

  // Collect all competitor names across clusters
  const allCompNames = [...new Set(clusters.flatMap(c => (c.competitors || []).map(x => x.name)))];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Theme Clusters</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>What topics competitors write about and where you have gaps — click a row for AI insight</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 180 }}>Theme</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 60 }}>Total</th>
              {allCompNames.map(name => (
                <th key={name} style={{ textAlign: 'center', padding: '10px 8px', minWidth: 90 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <CompanyLogo name={name} logoUrl={logoMap[name]} size={14} />
                    <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.72rem' }}>{name}</span>
                  </div>
                </th>
              ))}
              <th style={{ textAlign: 'center', padding: '10px 8px', width: 70 }}>
                <span style={{ fontWeight: 700, color: 'var(--azure)', fontSize: '0.72rem', textTransform: 'uppercase' }}>You</span>
              </th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 100 }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((cluster, i) => {
              const tc = trendColor(cluster.trend);
              const hasGap = !cluster.your_coverage || cluster.your_coverage === 0;
              const compMap = {};
              (cluster.competitors || []).forEach(c => { compMap[c.name] = c.count; });
              const isOpen = expandedTheme === i;

              return (
                <tr key={i}
                  onClick={() => setExpandedTheme(isOpen ? null : i)}
                  style={{
                    borderBottom: isOpen ? 'none' : '1px solid var(--gray-100)',
                    background: hasGap ? '#FFF8F8' : (i % 2 === 0 ? 'transparent' : 'var(--gray-50)'),
                    cursor: cluster.insight ? 'pointer' : 'default',
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{cluster.theme}</span>
                      {hasGap && <AlertTriangle size={12} style={{ color: '#DC2626', flexShrink: 0 }} />}
                    </div>
                    {/* Inline insight on expand */}
                    {isOpen && cluster.insight && (
                      <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.5, fontStyle: 'italic', borderTop: '1px solid var(--gray-200)', paddingTop: 8 }}>
                        {cluster.insight}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: 'var(--navy)' }}>{cluster.total_pieces}</td>
                  {allCompNames.map(name => {
                    const count = compMap[name];
                    return (
                      <td key={name} style={{ textAlign: 'center', padding: '12px', fontWeight: count ? 600 : 400, color: count ? 'var(--navy)' : 'var(--gray-300)' }}>
                        {count || '—'}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    {hasGap ? (
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#DC2626' }}>0</span>
                    ) : (
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>{cluster.your_coverage}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: tc.bg, color: tc.color, textTransform: 'capitalize' }}>
                      {trendIcon(cluster.trend)} {cluster.trend}
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
   CONTENT GAP OPPORTUNITIES — compact table + expandable recs
   ═══════════════════════════════════════════════════════════════ */
function ContentGaps({ gaps, logoMap }) {
  const [expandedGap, setExpandedGap] = useState(null);

  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Gap Opportunities</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Topics competitors cover that you don't — click to see recommendation</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {gaps.map((gap, i) => {
          const sev = severityColors[gap.severity] || severityColors.medium;
          const isOpen = expandedGap === i;
          return (
            <div key={i} style={{
              border: `1px solid ${sev.border}`, borderLeft: `4px solid ${sev.border}`,
              borderRadius: 8, background: sev.bg, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onClick={() => setExpandedGap(isOpen ? null : i)}
            >
              {/* Summary row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 12 }}>
                <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: sev.badge, color: '#fff', textTransform: 'uppercase', flexShrink: 0 }}>{gap.severity}</span>
                <strong style={{ color: sev.text, fontSize: '0.88rem', flex: 1 }}>{gap.topic}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {gap.competitors?.map((c, ci) => (
                    <span key={ci} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: sev.text }}>
                      <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={14} />
                      {c.count}
                    </span>
                  ))}
                </div>
                <span style={{ color: sev.text, flexShrink: 0 }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${sev.border}` }}>
                  {gap.sample_titles?.length > 0 && (
                    <div style={{ marginTop: 12, marginBottom: 10 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: sev.text, marginBottom: 4 }}>Competitor examples:</div>
                      {gap.sample_titles.map((t, ti) => (
                        <div key={ti} style={{ fontSize: '0.78rem', color: sev.text, opacity: 0.85, paddingLeft: 12, borderLeft: `2px solid ${sev.border}`, marginBottom: 3 }}>"{t}"</div>
                      ))}
                    </div>
                  )}
                  {gap.recommendation && (
                    <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.7)', border: `1px solid ${sev.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: sev.text, marginBottom: 4 }}><Lightbulb size={13} /> Recommended Action</div>
                      <div style={{ fontSize: '0.82rem', color: sev.text, lineHeight: 1.5 }}>{gap.recommendation}</div>
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
   KEYWORD LANDSCAPE — comparison table with per-competitor ranking
   ═══════════════════════════════════════════════════════════════ */
function KeywordLandscape({ keywords, logoMap }) {
  if (!keywords) return null;

  // Collect all competitor names from the keyword data
  const allCompetitorNames = [...new Set([
    ...(keywords.missing_keywords || []).flatMap(kw => (kw.competitors_ranking || []).map(c => c.name)),
    ...(keywords.movers || []).map(kw => kw.competitor),
  ])];

  const positionBadge = (pos) => {
    if (!pos) return <span style={{ color: 'var(--gray-300)', fontSize: '0.78rem' }}>—</span>;
    const color = pos <= 3 ? '#059669' : pos <= 10 ? '#D97706' : '#DC2626';
    const bg = pos <= 3 ? '#D1FAE5' : pos <= 10 ? '#FEF3C7' : '#FEE2E2';
    return (
      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.78rem', fontWeight: 700, background: bg, color }}>
        #{pos}
      </span>
    );
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Search size={18} style={{ color: 'var(--azure)' }} />
        <h3 className="section-title" style={{ margin: 0 }}>Keyword & Ranking Comparison</h3>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 20 }}>
        How each competitor ranks for key content keywords — red = you're missing it entirely
      </p>

      {/* Keywords comparison table */}
      {keywords.missing_keywords?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={sectionLabel('#DC2626')}>Keywords You're Missing</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 200 }}>Keyword</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Volume</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', minWidth: 60 }}>
                    <span style={{ fontWeight: 700, color: 'var(--azure)', fontSize: '0.72rem', textTransform: 'uppercase' }}>You</span>
                  </th>
                  {allCompetitorNames.map(name => (
                    <th key={name} style={{ textAlign: 'center', padding: '10px 8px', minWidth: 80 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <CompanyLogo name={name} logoUrl={logoMap?.[name]} size={14} />
                        <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.72rem' }}>{name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.missing_keywords.map((kw, i) => {
                  const rankMap = {};
                  (kw.competitors_ranking || []).forEach(c => { rankMap[c.name] = c.position; });
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? '#FFF5F5' : '#FFFAFA' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#991B1B' }}>{kw.keyword}</td>
                      <td style={{ textAlign: 'center', padding: '10px 8px', color: '#B91C1C', fontSize: '0.75rem' }}>{kw.search_volume ? fmt(kw.search_volume) : '—'}</td>
                      <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#DC2626' }}>Not ranking</span>
                      </td>
                      {allCompetitorNames.map(name => (
                        <td key={name} style={{ textAlign: 'center', padding: '10px 8px' }}>
                          {positionBadge(rankMap[name])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movers */}
      {keywords.movers?.length > 0 && (
        <div>
          <div style={sectionLabel('#D97706')}>Recent Keyword Movers</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 200 }}>Keyword</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Competitor</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Movement</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>New Position</th>
                </tr>
              </thead>
              <tbody>
                {keywords.movers.map((kw, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? '#FFFBEB' : '#FFFDF5' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#92400E' }}>{kw.keyword}</td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CompanyLogo name={kw.competitor} logoUrl={logoMap?.[kw.competitor]} size={14} />
                        <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{kw.competitor}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <span style={{ fontWeight: 700, color: kw.direction === 'up' ? '#059669' : '#DC2626', fontSize: '0.88rem' }}>
                        {kw.direction === 'up' ? '↑' : '↓'} {kw.change}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {positionBadge(kw.new_position)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   AI STRATEGIC INSIGHTS — compact, expandable
   ═══════════════════════════════════════════════════════════════ */
function StrategicInsights({ insights }) {
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
    background: cat === 'content' ? '#DBEAFE' : cat === 'seo' ? '#F3E8FF' : '#D1FAE5',
    color: cat === 'content' ? '#1E40AF' : cat === 'seo' ? '#6B21A8' : '#065F46',
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
        Actionable recommendations based on competitive content analysis
      </p>

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
                  }}>{i + 1}</div>
                  <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: sc.badge, color: '#fff', textTransform: 'uppercase' }}>{ins.priority}</span>
                  {ins.category && <span style={catStyle(ins.category)}>{ins.category}</span>}
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ins.type}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: sc.text, lineHeight: 1.4, marginBottom: 8 }}>{ins.action}</div>
                <div style={{ fontSize: '0.8rem', color: sc.text, opacity: 0.85, lineHeight: 1.5 }}>{ins.observation}</div>
                <div onClick={() => setExpandedIdx(prev => ({ ...prev, [`h${i}`]: !prev[`h${i}`] }))}
                  style={{ marginTop: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 600, color: sc.text, opacity: 0.7 }}>
                  {isOpen ? 'Hide impact analysis' : 'Show impact analysis'}
                  {isOpen ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                </div>
                {isOpen && (
                  <div style={{ marginTop: 6, padding: '10px 14px', borderRadius: 6, background: 'var(--gray-50)', border: '1px solid var(--gray-200)', fontSize: '0.78rem', color: sc.text, lineHeight: 1.5 }}>
                    {ins.implication}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {otherPriority.length > 0 && (
        <>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)', marginBottom: 10, paddingTop: 4, borderTop: '1px solid var(--gray-200)' }}>
            Also Consider
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {otherPriority.map((ins, i) => {
              const isOpen = expandedIdx[`o${i}`];
              return (
                <div key={`o${i}`} style={{ display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--gray-50)', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 80, paddingTop: 2 }}>
                    {ins.category && <div style={{ marginBottom: 4 }}><span style={catStyle(ins.category)}>{ins.category}</span></div>}
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ins.type}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{ins.action}</div>
                    <div onClick={() => setExpandedIdx(prev => ({ ...prev, [`o${i}`]: !prev[`o${i}`] }))}
                      style={{ marginTop: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', fontWeight: 600, color: 'var(--azure)' }}>
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
   MAIN COMPONENT — V2 with sub-tabs
   Tab 1: Overview (descriptive — what's happening)
   Tab 2: Topics & Strategy (prescriptive — what to do)
   ═══════════════════════════════════════════════════════════════ */
export default function ContentIntelV2({ data, meta }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  const tabs = [
    { key: 'overview', label: 'Overview & Activity', icon: <BarChart3 size={15} /> },
    { key: 'strategy', label: 'Topics & Strategy', icon: <Lightbulb size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Sub-tab navigation */}
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

      {/* Scorecard + Insights — always visible above tabs */}
      <Scorecard data={data.scorecard} />
      <StrategicInsights insights={data.strategic_insights} />

      {/* Tab 1: Overview & Activity */}
      {activeTab === 'overview' && (
        <>
          <ContentInventory inventory={data.content_inventory} logoMap={logoMap} />
          <ContentMixComparison competitors={data.publishing_cadence} inventory={data.content_inventory} logoMap={logoMap} />
          <PublishingCadence competitors={data.publishing_cadence} logoMap={logoMap} />
          <ActivityHeadlines items={data.activity_feed} logoMap={logoMap} />
        </>
      )}

      {/* Tab 2: Topics & Strategy */}
      {activeTab === 'strategy' && (
        <>
          <ThemeClusters clusters={data.theme_clusters} logoMap={logoMap} />
          <ContentGaps gaps={data.content_gaps} logoMap={logoMap} />
          <KeywordLandscape keywords={data.keyword_landscape} logoMap={logoMap} />
        </>
      )}
    </div>
  );
}
