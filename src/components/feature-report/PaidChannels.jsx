import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, ExternalLink, Lightbulb, ChevronDown, ChevronUp, ArrowUpRight, AlertTriangle, Target, MousePointer, Eye, Link } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/* ─── helpers ─── */
const fmtNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const trendIcon = (trend) => {
  if (!trend) return null;
  const t = trend.toLowerCase();
  if (t === 'up' || t === 'growing' || t === 'increasing') return <TrendingUp size={14} style={{ color: '#059669' }} />;
  if (t === 'down' || t === 'declining' || t === 'decreasing') return <TrendingDown size={14} style={{ color: '#DC2626' }} />;
  return <Minus size={14} style={{ color: '#6B7280' }} />;
};

const trendColor = (trend) => {
  if (!trend) return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
  const t = trend.toLowerCase();
  if (t === 'up' || t === 'growing' || t === 'increasing') return { bg: '#D1FAE5', color: '#065F46', border: '#059669' };
  if (t === 'down' || t === 'declining' || t === 'decreasing') return { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' };
  return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
};

const channelBadge = (ch) => {
  const colors = {
    'google ads': { bg: '#DBEAFE', color: '#1E40AF' },
    'linkedin': { bg: '#E0E7FF', color: '#3730A3' },
    'meta': { bg: '#DBEAFE', color: '#1E40AF' },
    'youtube': { bg: '#FEE2E2', color: '#991B1B' },
    'display': { bg: '#D1FAE5', color: '#065F46' },
  };
  const c = colors[(ch || '').toLowerCase()] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' };
  return c;
};


/* ═══════════════════════════════════════════════════════════════
   SCORECARD — observable metrics only
   ═══════════════════════════════════════════════════════════════ */
function Scorecard({ data }) {
  if (!data) return null;
  const stats = [
    { label: 'Your Paid Keywords', value: data.your_paid_keywords, accent: '#2563EB' },
    { label: 'Keyword Gaps (Paid)', value: data.keyword_gaps, accent: '#DC2626' },
    { label: 'Brand Terms Under Attack', value: data.brand_terms_attacked, accent: '#D97706' },
    { label: 'New Competitor Ads (30d)', value: data.new_ads_30d, accent: '#7C3AED' },
    { label: 'Channels Active', value: data.channels_active, accent: '#059669' },
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
   PPC KEYWORD OVERLAP — which keywords you share vs only they bid on
   ═══════════════════════════════════════════════════════════════ */
function KeywordOverlap({ data, logoMap }) {
  const [filter, setFilter] = useState('all');

  if (!data || data.length === 0) return null;

  const filters = ['all', 'gap', 'shared', 'yours only'];
  const filtered = filter === 'all' ? data
    : filter === 'gap' ? data.filter(k => !k.you_bid)
    : filter === 'shared' ? data.filter(k => k.you_bid && k.competitors_bidding?.length > 0)
    : data.filter(k => k.you_bid && (!k.competitors_bidding || k.competitors_bidding.length === 0));

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>PPC Keyword Landscape</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 14 }}>Keywords in the paid search space — where you compete and where you're absent</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === f ? 'var(--azure)' : 'var(--gray-200)',
            background: filter === f ? 'var(--azure)' : 'transparent',
            color: filter === f ? '#fff' : 'var(--gray-600)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {f === 'all' ? `All (${data.length})` : f === 'gap' ? `Gaps (${data.filter(k => !k.you_bid).length})` : f === 'shared' ? `Shared (${data.filter(k => k.you_bid && k.competitors_bidding?.length > 0).length})` : `Yours Only (${data.filter(k => k.you_bid && (!k.competitors_bidding || k.competitors_bidding.length === 0)).length})`}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', minWidth: 220 }}>Keyword</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Channel</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Volume</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Avg CPC</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 60 }}>You</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Also Bidding</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kw, i) => {
              const isGap = !kw.you_bid;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isGap ? '#FFF8F8' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: isGap ? '#991B1B' : 'var(--navy)' }}>{kw.keyword}</div>
                    {kw.intent && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 3, background: 'var(--gray-100)', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{kw.intent}</span>}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    {kw.channel && (() => { const cb = channelBadge(kw.channel); return (
                      <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 600, background: cb.bg, color: cb.color }}>{kw.channel}</span>
                    ); })()}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: 'var(--gray-600)' }}>{fmtNum(kw.volume)}/mo</td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: 'var(--navy)' }}>${kw.avg_cpc}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    {kw.you_bid
                      ? <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>Yes</span>
                      : <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#DC2626' }}>No</span>
                    }
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {kw.competitors_bidding?.map((c, ci) => (
                        <span key={ci} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 4, background: 'var(--gray-100)', fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                          <CompanyLogo name={c} logoUrl={logoMap[c]} size={13} />
                          {c}
                        </span>
                      ))}
                      {(!kw.competitors_bidding || kw.competitors_bidding.length === 0) && <span style={{ color: 'var(--gray-300)', fontSize: '0.75rem' }}>No competitors</span>}
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
   BRAND KEYWORD PROTECTION — who bids on your brand terms
   Garima: "heavy money leakage area" [55:25]
   ═══════════════════════════════════════════════════════════════ */
function BrandKeywords({ data, logoMap }) {
  if (!data || data.length === 0) return null;

  const underAttack = data.filter(d => d.bidders?.length > 0);

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>Brand Keyword Protection</h3>
        {underAttack.length > 0 && (
          <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
            {underAttack.length} under attack
          </span>
        )}
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Competitors bidding on your brand terms — intercepting your high-intent traffic</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Your Brand Keyword</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Channel</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Volume</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Competitors Bidding</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Threat</th>
            </tr>
          </thead>
          <tbody>
            {data.map((kw, i) => {
              const threatColors = {
                high: { bg: '#FEE2E2', color: '#991B1B', badge: '#DC2626' },
                medium: { bg: '#FEF3C7', color: '#92400E', badge: '#D97706' },
                low: { bg: '#D1FAE5', color: '#065F46', badge: '#059669' },
              };
              const tc = threatColors[kw.threat] || threatColors.medium;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: kw.threat === 'high' ? '#FFF8F8' : 'transparent' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--navy)' }}>{kw.keyword}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    {kw.channel && (() => { const cb = channelBadge(kw.channel); return (
                      <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 600, background: cb.bg, color: cb.color }}>{kw.channel}</span>
                    ); })()}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: 'var(--gray-600)' }}>{fmtNum(kw.volume)}/mo</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {kw.bidders?.map((b, bi) => (
                        <span key={bi} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'var(--gray-100)', fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                          <CompanyLogo name={b.name} logoUrl={logoMap[b.name]} size={14} />
                          {b.name}
                          {b.ad_position && <span style={{ fontWeight: 700, color: 'var(--navy)' }}>#{b.ad_position}</span>}
                        </span>
                      ))}
                      {(!kw.bidders || kw.bidders.length === 0) && <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>Safe — no competitors</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: tc.badge, color: '#fff', textTransform: 'uppercase' }}>{kw.threat}</span>
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
   AD THEME CLUSTERS — paid keywords & ad copies grouped by theme
   Cross-channel view: same theme appearing on Google + LinkedIn = serious investment
   ═══════════════════════════════════════════════════════════════ */
function AdThemeClusters({ themes, logoMap }) {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themes || themes.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Ad Theme Clusters</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        Paid keywords and ad copies grouped by theme — reveals where competitors concentrate spend across channels
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {themes.map((theme, i) => {
          const isOpen = expandedTheme === i;
          const tc = trendColor(theme.trend);
          const totalAds = Object.values(theme.channels || {}).reduce((s, v) => s + v, 0);
          const allChannels = Object.keys(theme.channels || {});

          return (
            <div key={i} style={{
              borderRadius: 8, border: '1px solid var(--gray-200)',
              background: '#fff', overflow: 'hidden',
            }}>
              {/* Theme header row */}
              <div
                onClick={() => setExpandedTheme(isOpen ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  cursor: 'pointer', flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {theme.theme}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 4,
                      fontSize: '0.65rem', fontWeight: 700, background: tc.bg, color: tc.color,
                    }}>
                      {trendIcon(theme.trend)} {theme.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 3 }}>
                    {totalAds} ads · {theme.keywords_count} keywords
                  </div>
                </div>

                {/* Channel distribution mini-bar */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {allChannels.map(ch => {
                    const cb = channelBadge(ch);
                    const count = theme.channels[ch];
                    if (!count) return null;
                    return (
                      <span key={ch} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 600,
                        background: cb.bg, color: cb.color,
                      }}>
                        {ch}: {count}
                      </span>
                    );
                  })}
                </div>

                {/* Competitor logos */}
                <div style={{ display: 'flex', gap: -4, alignItems: 'center' }}>
                  {theme.competitors?.map((c, ci) => (
                    <div key={ci} style={{ marginLeft: ci > 0 ? -4 : 0 }} title={c.name}>
                      <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={22} />
                    </div>
                  ))}
                </div>

                {/* Your presence */}
                <div style={{ minWidth: 60, textAlign: 'center' }}>
                  {theme.your_ads > 0 ? (
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>{theme.your_ads} ads</span>
                  ) : (
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#FEE2E2', color: '#DC2626' }}>Gap</span>
                  )}
                </div>

                <ChevronDown size={14} style={{ color: 'var(--gray-400)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--gray-100)' }}>
                  {/* Per-competitor breakdown */}
                  <div style={{ overflowX: 'auto', marginTop: 12 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase' }}>Company</th>
                          <th style={{ textAlign: 'center', padding: '8px 6px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase' }}>Ads</th>
                          {allChannels.map(ch => (
                            <th key={ch} style={{ textAlign: 'center', padding: '8px 6px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase' }}>{ch}</th>
                          ))}
                          <th style={{ textAlign: 'center', padding: '8px 6px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase' }}>Intensity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {theme.competitors?.map((c, ci) => {
                          const intColors = { high: { bg: '#FEE2E2', color: '#991B1B' }, medium: { bg: '#FEF3C7', color: '#92400E' }, low: { bg: '#F3F4F6', color: '#374151' } };
                          const ic = intColors[c.intensity] || intColors.medium;
                          return (
                            <tr key={ci} style={{ borderBottom: '1px solid var(--gray-50)' }}>
                              <td style={{ padding: '8px 10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <CompanyLogo name={c.name} logoUrl={logoMap[c.name]} size={16} />
                                  <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{c.name}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px 6px', fontWeight: 700, color: 'var(--navy)' }}>{c.ads}</td>
                              {allChannels.map(ch => (
                                <td key={ch} style={{ textAlign: 'center', padding: '8px 6px', color: c.by_channel?.[ch] ? 'var(--gray-700)' : 'var(--gray-300)' }}>
                                  {c.by_channel?.[ch] || '—'}
                                </td>
                              ))}
                              <td style={{ textAlign: 'center', padding: '8px 6px' }}>
                                <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700, background: ic.bg, color: ic.color, textTransform: 'uppercase' }}>{c.intensity}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Sample keywords in this theme */}
                  {theme.sample_keywords?.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 6 }}>Sample Keywords</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {theme.sample_keywords.map((kw, ki) => (
                          <span key={ki} style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', background: 'var(--gray-100)', color: 'var(--gray-600)' }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insight */}
                  {theme.insight && (
                    <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.5, fontStyle: 'italic', paddingLeft: 10, borderLeft: '2px solid var(--gray-200)' }}>
                      {theme.insight}
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
   AD COPY TRACKER — competitor ad headlines + descriptions
   Observable from Google Ads Transparency + Ad Libraries
   ═══════════════════════════════════════════════════════════════ */
function AdCopyTracker({ ads, logoMap }) {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Ad Copy Tracker</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Competitor ad creatives detected across channels — messaging signals for battle cards</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ads.map((ad, i) => {
          const cb = channelBadge(ad.channel);
          return (
            <div key={i} style={{
              borderRadius: 8, border: '1px solid var(--gray-200)', padding: '16px 18px', background: '#fff',
              borderLeft: `3px solid ${cb.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <CompanyLogo name={ad.company} logoUrl={logoMap[ad.company]} size={18} />
                <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.82rem' }}>{ad.company}</span>
                <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: cb.bg, color: cb.color, textTransform: 'uppercase' }}>{ad.channel}</span>
                {ad.is_new && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase' }}>New</span>}
                <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--gray-400)' }}>{ad.detected_date}</span>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 6, background: 'var(--gray-50)', border: '1px solid var(--gray-200)', marginBottom: 8 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A0DAB', marginBottom: 4, lineHeight: 1.3 }}>{ad.headline}</div>
                {ad.description && <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.4 }}>{ad.description}</div>}
                {ad.display_url && <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: 4 }}>{ad.display_url}</div>}
              </div>

              {ad.landing_page && (
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Link size={11} /> Landing: <span style={{ color: 'var(--gray-600)' }}>{ad.landing_page}</span>
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
   LANDING PAGE MONITOR — where competitor ads send traffic
   ═══════════════════════════════════════════════════════════════ */
function LandingPageMonitor({ pages, logoMap }) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Landing Page Monitor</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Where competitor paid ads send traffic — their conversion pages</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Landing Page</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Ad Channels</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keywords</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Page Type</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CompanyLogo name={page.company} logoUrl={logoMap[page.company]} size={18} />
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{page.company}</span>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 500, color: 'var(--navy)', fontSize: '0.82rem', marginBottom: 2 }}>{page.title}</div>
                  <div style={{ fontSize: '0.68rem', color: '#059669' }}>{page.url}</div>
                </td>
                <td style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {(page.channels || []).map((ch, ci) => {
                      const cb = channelBadge(ch);
                      return <span key={ci} style={{ padding: '2px 6px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 600, background: cb.bg, color: cb.color }}>{ch}</span>;
                    })}
                    {(!page.channels || page.channels.length === 0) && <span style={{ color: 'var(--gray-300)', fontSize: '0.72rem' }}>—</span>}
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: 'var(--navy)' }}>{page.keywords_count}</td>
                <td style={{ textAlign: 'center', padding: '12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.68rem', fontWeight: 600, background: 'var(--gray-100)', color: 'var(--gray-600)', textTransform: 'capitalize' }}>{page.page_type}</span>
                </td>
                <td style={{ textAlign: 'center', padding: '12px' }}>
                  {page.is_new ? (
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E' }}>New</span>
                  ) : (
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 600, background: 'var(--gray-100)', color: 'var(--gray-500)' }}>Active</span>
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


/* ═══════════════════════════════════════════════════════════════
   WHAT TO DO NEXT — consistent pattern
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
  };

  const catStyle = (cat) => ({
    padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700,
    background: cat === 'brand' ? '#FEE2E2' : cat === 'paid search' ? '#DBEAFE' : '#D1FAE5',
    color: cat === 'brand' ? '#991B1B' : cat === 'paid search' ? '#1E40AF' : '#065F46',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  });

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>What To Do Next</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>{highPriority.length} Priority</span>
          {otherPriority.length > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-500)', border: '1px solid var(--gray-200)' }}>{otherPriority.length} Also Consider</span>
          )}
        </div>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 20 }}>Actionable recommendations based on competitive paid channel data</p>

      {highPriority.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: otherPriority.length > 0 ? 24 : 0 }}>
          {highPriority.map((ins, i) => {
            const isOpen = expandedIdx[`h${i}`];
            const sc = sevColors[ins.priority] || sevColors.high;
            return (
              <div key={`h${i}`} style={{ borderRadius: 8, border: '1px solid var(--gray-200)', borderLeft: `4px solid ${sc.border}`, background: '#fff', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ minWidth: 24, height: 24, borderRadius: '50%', background: sc.badge, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
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
                  <div style={{ marginTop: 6, padding: '10px 14px', borderRadius: 6, background: 'var(--gray-50)', border: '1px solid var(--gray-200)', fontSize: '0.78rem', color: sc.text, lineHeight: 1.5 }}>{ins.implication}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {otherPriority.length > 0 && (
        <>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)', marginBottom: 10, paddingTop: 4, borderTop: '1px solid var(--gray-200)' }}>Also Consider</div>
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
   PAID ACTIVITY OVERVIEW — snapshot: how many ads per competitor per channel
   ═══════════════════════════════════════════════════════════════ */
function PaidActivityOverview({ activity, logoMap }) {
  if (!activity || activity.length === 0) return null;

  const channels = [...new Set(activity.flatMap(a => Object.keys(a.ads_by_channel || {})))];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Paid Activity Overview</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Current snapshot — how many ads each competitor is running per channel</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Total Ads</th>
              {channels.map(ch => {
                const cb = channelBadge(ch);
                return <th key={ch} style={{ textAlign: 'center', padding: '10px 8px', color: cb.color, fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{ch}</th>;
              })}
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Paid Keywords</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>30d Trend</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((comp, i) => {
              const isYou = comp.is_you;
              const tc = trendColor(comp.trend);
              const totalAds = Object.values(comp.ads_by_channel || {}).reduce((s, v) => s + v, 0);
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isYou ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                      {isYou && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>{totalAds}</td>
                  {channels.map(ch => {
                    const count = comp.ads_by_channel?.[ch] || 0;
                    return (
                      <td key={ch} style={{ textAlign: 'center', padding: '12px', color: count > 0 ? 'var(--gray-700)' : 'var(--gray-300)', fontWeight: count > 0 ? 600 : 400 }}>
                        {count > 0 ? count : '—'}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: 'var(--gray-600)' }}>{fmtNum(comp.paid_keywords)}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4,
                      fontSize: '0.68rem', fontWeight: 700, background: tc.bg, color: tc.color, textTransform: 'capitalize',
                    }}>
                      {trendIcon(comp.trend)} {comp.trend}
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
   PAID ACTIVITY TREND — are competitors ramping up or pulling back?
   Daily snapshots compared across periods
   ═══════════════════════════════════════════════════════════════ */
function PaidActivityTrend({ trends, logoMap }) {
  if (!trends || trends.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Paid Activity Trend</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>How competitor paid activity changed — are they going heavier or pulling back?</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Ads Now</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Ads 30d Ago</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Change</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keywords Now</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Keywords 30d Ago</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Change</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((comp, i) => {
              const adsChange = comp.ads_now - comp.ads_30d_ago;
              const kwChange = comp.keywords_now - comp.keywords_30d_ago;
              const adsColor = adsChange > 0 ? '#059669' : adsChange < 0 ? '#DC2626' : 'var(--gray-400)';
              const kwColor = kwChange > 0 ? '#059669' : kwChange < 0 ? '#DC2626' : 'var(--gray-400)';

              const signalColors = {
                'Ramping Up': { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' },
                'Steady': { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' },
                'Pulling Back': { bg: '#D1FAE5', color: '#065F46', border: '#059669' },
                'New Entrant': { bg: '#FEF3C7', color: '#92400E', border: '#D97706' },
              };
              const sc = signalColors[comp.signal] || signalColors['Steady'];

              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: comp.is_you ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                      {comp.is_you && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: 'var(--navy)' }}>{comp.ads_now}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: 'var(--gray-500)' }}>{comp.ads_30d_ago}</td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: adsColor }}>
                    {adsChange > 0 ? '+' : ''}{adsChange}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: 'var(--navy)' }}>{fmtNum(comp.keywords_now)}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: 'var(--gray-500)' }}>{fmtNum(comp.keywords_30d_ago)}</td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: kwColor }}>
                    {kwChange > 0 ? '+' : ''}{kwChange}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700,
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      whiteSpace: 'nowrap',
                    }}>{comp.signal}</span>
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
   MAIN COMPONENT — 2 sub-tabs
   Tab 1: Overview & Keywords
   Tab 2: Ad Creative & Landing Pages
   ═══════════════════════════════════════════════════════════════ */
export default function PaidChannels({ data, meta }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  const tabs = [
    { key: 'overview', label: 'Overview & Keywords', icon: <Target size={15} /> },
    { key: 'creative', label: 'Ad Creative & Landing Pages', icon: <MousePointer size={15} /> },
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
          <PaidActivityOverview activity={data.paid_activity} logoMap={logoMap} />
          <PaidActivityTrend trends={data.paid_trend} logoMap={logoMap} />
          <KeywordOverlap data={data.keyword_landscape} logoMap={logoMap} />
          <BrandKeywords data={data.brand_keywords} logoMap={logoMap} />
        </>
      )}

      {activeTab === 'creative' && (
        <>
          <AdThemeClusters themes={data.ad_themes} logoMap={logoMap} />
          <AdCopyTracker ads={data.ad_copies} logoMap={logoMap} />
          <LandingPageMonitor pages={data.landing_pages} logoMap={logoMap} />
          <Recommendations insights={data.recommendations} />
        </>
      )}
    </div>
  );
}
