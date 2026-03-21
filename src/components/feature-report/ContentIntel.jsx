import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Lightbulb, AlertTriangle, BarChart3, FileText, Video, BookOpen, Mic, FileSpreadsheet, Newspaper, ChevronDown, ChevronUp, ArrowUpRight, Target, Layers, Search } from 'lucide-react';
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

const sectionLabel = (text, color = 'var(--azure)') => ({
  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.06em', color, marginBottom: 8,
});


/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — Scorecard
   ═══════════════════════════════════════════════════════════════ */
function Scorecard({ data }) {
  if (!data) return null;
  const stats = [
    { label: 'Content Tracked (30d)', value: data.total_content_30d, icon: <FileText size={16} /> },
    { label: 'Your Rate vs Avg Competitor', value: data.your_rate_vs_avg, icon: <BarChart3 size={16} /> },
    { label: 'Content Gaps Found', value: data.gaps_found, icon: <Target size={16} /> },
    { label: 'Top Trending Theme', value: data.top_trending_theme, icon: <TrendingUp size={16} /> },
    { label: 'Most Active Competitor', value: data.most_active_competitor, icon: <Layers size={16} /> },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 28 }}>
      {stats.map((s, i) => (
        <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-400)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {s.icon}
            {s.label}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>{s.value ?? '—'}</div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — Content Activity Headlines
   Garima: "headlines where I can skim through" [14:39]
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
          <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', margin: 0 }}>
            Latest competitor content — skim headlines, expand for details
          </p>
        </div>
      </div>

      {/* Filter pills */}
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

      {/* Items */}
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
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>
                      {item.title}
                    </span>
                    {item.notable && (
                      <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase', flexShrink: 0 }}>Notable</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: 'var(--gray-400)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-600)' }}>{item.company}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: typeColor }}>
                      {contentTypeIcon(item.content_type)}
                      {item.content_type}
                    </span>
                    <span>•</span>
                    <span>{item.date}</span>
                    {item.topics?.map((t, ti) => (
                      <span key={ti} style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, background: 'var(--gray-200)', color: 'var(--gray-600)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: 'var(--gray-400)' }}>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gray-200)' }}>
                  {item.summary && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: '0 0 10px' }}>{item.summary}</p>
                  )}
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
   SECTION 3 — Content Theme Clusters
   Garima: "Cluster format. Identify recurring themes." [46:20]
   ═══════════════════════════════════════════════════════════════ */
function ThemeClusters({ clusters, logoMap }) {
  if (!clusters || clusters.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Theme Clusters</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        Recurring topics across competitor content — spot what they're investing in and where you have gaps
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {clusters.map((cluster, i) => {
          const tc = trendColor(cluster.trend);
          const hasGap = !cluster.your_coverage || cluster.your_coverage === 0;
          return (
            <div key={i} style={{
              border: `1px solid ${hasGap ? '#DC2626' : 'var(--gray-200)'}`,
              borderRadius: 8, padding: 18,
              background: hasGap ? '#FFF5F5' : 'var(--gray-50)',
              borderTop: `3px solid ${hasGap ? '#DC2626' : tc.border || 'var(--gray-300)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{cluster.theme}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {cluster.total_pieces} pieces across {cluster.competitors?.length || 0} competitors
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {trendIcon(cluster.trend)}
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: tc.bg, color: tc.color, textTransform: 'capitalize',
                  }}>{cluster.trend}</span>
                </div>
              </div>

              {/* Competitor logos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                {cluster.competitors?.map((c, ci) => (
                  <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 4, background: 'var(--gray-100)', fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={14} />
                    <span>{c.name}</span>
                    <span style={{ fontWeight: 700 }}>({c.count})</span>
                  </div>
                ))}
              </div>

              {/* Your coverage */}
              <div style={{
                padding: '8px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
                background: hasGap ? '#FEE2E2' : '#D1FAE5',
                color: hasGap ? '#991B1B' : '#065F46',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {hasGap ? <AlertTriangle size={13} /> : null}
                {hasGap
                  ? 'No coverage — content gap opportunity'
                  : `Your coverage: ${cluster.your_coverage} pieces`
                }
              </div>

              {/* AI insight */}
              {cluster.insight && (
                <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {cluster.insight}
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
   SECTION 4 — Content Mix & Publishing Cadence
   Garima: "last 30 days, what they've written, last 3 months" [56:25]
   ═══════════════════════════════════════════════════════════════ */
function ContentMixCadence({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  const maxPosts = Math.max(...competitors.map(c => c.posts_30d || 0), 1);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Publishing Cadence & Content Mix</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        How often competitors publish and what formats they use
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {competitors.map((comp, i) => {
          const tc = trendColor(comp.trend);
          return (
            <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: 18, background: 'var(--gray-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy)' }}>{comp.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                    Avg {comp.avg_per_month} posts/mo
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>{comp.posts_30d}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Last 30d</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-500)' }}>{comp.posts_90d}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Last 90d</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {trendIcon(comp.trend)}
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: tc.bg, color: tc.color, textTransform: 'capitalize',
                    }}>{comp.trend}</span>
                  </div>
                </div>
              </div>

              {/* Volume bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}>
                  <div style={{ width: `${(comp.posts_30d / maxPosts) * 100}%`, height: '100%', borderRadius: 3, background: tc.border || '#2563EB', transition: 'width 0.3s' }} />
                </div>
              </div>

              {/* Content mix */}
              {comp.content_mix && (
                <>
                  <div style={sectionLabel('var(--gray-500)')}>Content Mix</div>
                  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    {Object.entries(comp.content_mix).filter(([, v]) => v > 0).map(([k, v]) => (
                      <div key={k} style={{ width: `${v}%`, background: contentTypeColor(k) }} title={`${k}: ${v}%`} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {Object.entries(comp.content_mix).filter(([, v]) => v > 0).map(([k, v]) => (
                      <span key={k} style={{ fontSize: '0.68rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: contentTypeColor(k), display: 'inline-block' }} />
                        {k} {v}%
                      </span>
                    ))}
                  </div>

                  {/* Format gaps */}
                  {comp.format_gaps?.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {comp.format_gaps.map((g, gi) => (
                        <span key={gi} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#FEE2E2', color: '#991B1B' }}>
                          Gap: no {g}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — Content Gap Opportunities
   Garima: "content gap analysis" [57:03]
   ═══════════════════════════════════════════════════════════════ */
function ContentGaps({ gaps, logoMap }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Content Gap Opportunities</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        Topics competitors are covering that you're not — direct input for your content calendar
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {gaps.map((gap, i) => {
          const sev = severityColors[gap.severity] || severityColors.medium;
          return (
            <div key={i} style={{
              border: `1px solid ${sev.border}`, borderLeft: `4px solid ${sev.border}`,
              borderRadius: 8, padding: 20, background: sev.bg,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong style={{ color: sev.text, fontSize: '0.95rem' }}>{gap.topic}</strong>
                <span style={{
                  padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: sev.badge, color: '#fff', textTransform: 'uppercase',
                }}>{gap.severity}</span>
              </div>

              {/* Competitors covering this */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: sev.text }}>Covered by:</span>
                {gap.competitors?.map((c, ci) => (
                  <span key={ci} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', color: sev.text }}>
                    <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={13} />
                    {c.name} ({c.count})
                  </span>
                ))}
              </div>

              {/* Sample competitor titles */}
              {gap.sample_titles?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: sev.text, marginBottom: 4 }}>Competitor content examples:</div>
                  {gap.sample_titles.map((t, ti) => (
                    <div key={ti} style={{ fontSize: '0.78rem', color: sev.text, opacity: 0.85, paddingLeft: 12, borderLeft: `2px solid ${sev.border}`, marginBottom: 3 }}>
                      "{t}"
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendation */}
              {gap.recommendation && (
                <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.7)', border: `1px solid ${sev.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: sev.text, marginBottom: 4 }}>
                    <Lightbulb size={13} /> Recommendation
                  </div>
                  <div style={{ fontSize: '0.82rem', color: sev.text, lineHeight: 1.5 }}>{gap.recommendation}</div>
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
   SECTION 6 — Keyword Landscape Snapshot
   Garima: "top ranking keywords" [47:54], Jeevithan: #1 ask
   Gaurav: AEO tracking [22:46]
   ═══════════════════════════════════════════════════════════════ */
function KeywordLandscape({ keywords }) {
  if (!keywords) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Search size={18} style={{ color: 'var(--azure)' }} />
        <h3 className="section-title" style={{ margin: 0 }}>Keyword & Ranking Snapshot</h3>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        Keywords where competitors rank and you don't — content opportunities from an SEO lens
      </p>

      {/* Keywords you're missing */}
      {keywords.missing_keywords?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabel('#DC2626')}>Keywords You're Missing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {keywords.missing_keywords.map((kw, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 6, background: '#FFF5F5', border: '1px solid #FECACA',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#991B1B' }}>{kw.keyword}</span>
                  {kw.search_volume && <span style={{ fontSize: '0.72rem', color: '#B91C1C', marginLeft: 8 }}>Vol: {fmt(kw.search_volume)}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {kw.competitors_ranking?.map((c, ci) => (
                    <span key={ci} style={{ fontSize: '0.72rem', color: '#991B1B', fontWeight: 500 }}>
                      {c.name} #{c.position}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyword movers */}
      {keywords.movers?.length > 0 && (
        <div>
          <div style={sectionLabel('#D97706')}>Recent Keyword Movers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {keywords.movers.map((kw, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 6, background: '#FFFBEB', border: '1px solid #FDE68A',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#92400E' }}>{kw.keyword}</span>
                  <span style={{ fontSize: '0.72rem', color: '#B45309', marginLeft: 8 }}>{kw.competitor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: kw.direction === 'up' ? '#059669' : '#DC2626' }}>
                    {kw.direction === 'up' ? '↑' : '↓'} {kw.change} positions
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#92400E' }}>→ #{kw.new_position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — AI Strategic Insights & Recommendations
   Garima: "insights will flip the whole game" [41:37]
   Rajesh: "The decision is far more important" [08:31]
   ═══════════════════════════════════════════════════════════════ */
function StrategicInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  const priorityColors = {
    high: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', badge: '#DC2626' },
    medium: { bg: '#FEF3C7', border: '#D97706', text: '#92400E', badge: '#D97706' },
    low: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF', badge: '#2563EB' },
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Lightbulb size={18} style={{ color: '#D97706' }} />
        <h3 className="section-title" style={{ margin: 0 }}>AI Strategic Insights</h3>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        What the data means and what you should do next
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map((ins, i) => {
          const pc = priorityColors[ins.priority] || priorityColors.medium;
          return (
            <div key={i} style={{
              border: `1px solid ${pc.border}`, borderRadius: 8, padding: 20,
              background: pc.bg, borderLeft: `4px solid ${pc.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: pc.badge, color: '#fff', textTransform: 'uppercase',
                }}>{ins.priority} priority</span>
                {ins.type && (
                  <span style={{ fontSize: '0.72rem', color: pc.text, fontWeight: 600, textTransform: 'uppercase' }}>{ins.type}</span>
                )}
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ ...sectionLabel(pc.text), marginBottom: 4 }}>Observation</div>
                <div style={{ fontSize: '0.85rem', color: pc.text, lineHeight: 1.6 }}>{ins.observation}</div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ ...sectionLabel(pc.text), marginBottom: 4 }}>Implication</div>
                <div style={{ fontSize: '0.85rem', color: pc.text, lineHeight: 1.6 }}>{ins.implication}</div>
              </div>

              <div style={{
                padding: '12px 16px', borderRadius: 6,
                background: 'rgba(255,255,255,0.7)', border: `1px solid ${pc.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <ArrowUpRight size={14} style={{ color: pc.text }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: pc.text, textTransform: 'uppercase' }}>Recommended Action</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: pc.text, lineHeight: 1.6 }}>{ins.action}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ContentIntel({ data, meta }) {
  if (!data) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Scorecard data={data.scorecard} />
      <ActivityHeadlines items={data.activity_feed} logoMap={logoMap} />
      <ThemeClusters clusters={data.theme_clusters} logoMap={logoMap} />
      <ContentGaps gaps={data.content_gaps} logoMap={logoMap} />
      <ContentMixCadence competitors={data.publishing_cadence} logoMap={logoMap} />
      <KeywordLandscape keywords={data.keyword_landscape} />
      <StrategicInsights insights={data.strategic_insights} />
    </div>
  );
}
