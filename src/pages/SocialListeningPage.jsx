import { useState, useEffect } from 'react';
import { Spin, theme } from 'antd';
import { Globe, TrendingUp, BarChart3, MessageCircle, Radio, AlertTriangle, RefreshCw } from 'lucide-react';
import { socialListeningApi } from '../services/api';
import CompanyLogo from '../components/feature-report/CompanyLogo';

const GOLD = '#C9A84C';

const PLATFORM_COLORS = {
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  reddit: '#FF4500',
  youtube: '#A855F7',
};

const PLATFORM_ICONS = {
  twitter: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  reddit: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  ),
  youtube: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

const THEME_LABELS = {
  ai_ml: 'AI / ML',
  product: 'Product',
  customers: 'Customers',
  culture: 'Culture',
  compliance: 'Compliance',
  pricing: 'Pricing',
  partnerships: 'Partnerships',
  events: 'Events',
  other: 'Other',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function heatmapBg(pct) {
  if (pct <= 10) return { background: 'rgba(0,0,0,0.04)', color: 'inherit' };
  if (pct <= 25) return { background: 'rgba(59, 130, 246, 0.15)', color: 'inherit' };
  if (pct <= 40) return { background: 'rgba(59, 130, 246, 0.3)', color: 'inherit' };
  if (pct <= 60) return { background: 'rgba(59, 130, 246, 0.5)', color: 'inherit' };
  return { background: 'rgba(59, 130, 246, 0.7)', color: '#fff' };
}

function SentimentDonut({ positive, neutral, negative, size = 80 }) {
  const total = positive + neutral + negative;
  if (total === 0) return null;
  const r = 30;
  const circumference = 2 * Math.PI * r;
  const posLen = (positive / total) * circumference;
  const neuLen = (neutral / total) * circumference;
  const negLen = (negative / total) * circumference;

  const posOffset = 0;
  const neuOffset = -(posLen);
  const negOffset = -(posLen + neuLen);

  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#ef4444" strokeWidth="10"
        strokeDasharray={`${negLen} ${circumference - negLen}`}
        strokeDashoffset={negOffset}
        transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="#9ca3af" strokeWidth="10"
        strokeDasharray={`${neuLen} ${circumference - neuLen}`}
        strokeDashoffset={neuOffset}
        transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="#22c55e" strokeWidth="10"
        strokeDasharray={`${posLen} ${circumference - posLen}`}
        strokeDashoffset={posOffset}
        transform="rotate(-90 40 40)" />
    </svg>
  );
}

function PlatformIcon({ platform, size = 14 }) {
  const icon = PLATFORM_ICONS[platform];
  if (!icon) return null;
  return (
    <span style={{ color: PLATFORM_COLORS[platform], display: 'inline-flex', alignItems: 'center' }}>
      {icon(size)}
    </span>
  );
}

function SourcePills({ sources, token }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
      {sources.map((s, i) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 11, color: PLATFORM_COLORS[s.platform] || '#2B7AE8', textDecoration: 'none',
            padding: '3px 8px', borderRadius: 4,
            background: `${PLATFORM_COLORS[s.platform] || '#2B7AE8'}10`,
            border: `1px solid ${PLATFORM_COLORS[s.platform] || '#2B7AE8'}30`,
            maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'opacity 0.15s',
          }}
          title={s.title || s.url}
        >
          <PlatformIcon platform={s.platform} size={10} />
          {s.title || s.url}
        </a>
      ))}
    </div>
  );
}

export default function SocialListeningPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const insightsResult = await socialListeningApi.getInsights();
      setData(insightsResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReanalyze() {
    try {
      setAnalyzing(true);
      await socialListeningApi.triggerAnalysis();
      // Poll for fresh results — analysis runs async
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const fresh = await socialListeningApi.getInsights();
          // Check if data is newer than what we have
          const oldTs = data?.insights?.executive_summary?.generated_at;
          const newTs = fresh?.insights?.executive_summary?.generated_at;
          if (newTs && newTs !== oldTs) {
            clearInterval(poll);
            setData(fresh);
            setAnalyzing(false);
          } else if (attempts >= 30) {
            clearInterval(poll);
            setAnalyzing(false);
          }
        } catch (_) {
          if (attempts >= 30) {
            clearInterval(poll);
            setAnalyzing(false);
          }
        }
      }, 5000);
    } catch (err) {
      console.error('Analysis trigger failed:', err);
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
        <Spin size="large" />
        <div style={{ fontSize: 14, color: token.colorTextSecondary }}>Generating social intelligence...</div>
      </div>
    );
  }

  const insights = data?.insights;

  if (error || !insights) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
        <Globe size={48} style={{ color: token.colorTextQuaternary }} />
        <div style={{ fontSize: 20, fontWeight: 700, color: token.colorText }}>No social intelligence data yet</div>
        <div style={{ fontSize: 14, color: token.colorTextSecondary, maxWidth: 460, textAlign: 'center', lineHeight: 1.6 }}>
          Configure social listening for your companies and collect data to generate insights.
        </div>
      </div>
    );
  }

  const execSummary = insights.executive_summary?.data;
  const themesData = insights.themes?.data;
  const engagementData = insights.engagement?.data;
  const cadenceData = insights.cadence?.data;
  const redditData = insights.reddit_sentiment?.data;

  const cardStyle = {
    background: token.colorBgContainer,
    borderRadius: 12,
    padding: '28px 32px',
    border: `1px solid ${token.colorBorderSecondary}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  };

  const innerCardStyle = {
    background: token.colorBgLayout || '#fafafa',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: 8,
    padding: 20,
  };

  const sectionCard = (accentColor) => ({
    ...cardStyle,
    borderTop: `3px solid ${accentColor}`,
  });

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: 600,
    color: token.colorText,
    marginBottom: 16,
  };

  // --- Helpers for executive summary cards ---
  const ownCadence = cadenceData?.companies?.find(c => c.is_own);
  const cadenceRank = cadenceData?.rank || [];
  const allCadenceSorted = [...(cadenceData?.companies || [])].sort((a, b) => b.posts_per_week - a.posts_per_week);
  const ownRank = allCadenceSorted.findIndex(c => c.is_own) + 1;
  const topCompetitorCadence = cadenceRank[0];
  const keyMetrics = execSummary?.key_metrics || {};
  const ownReddit = redditData?.companies?.find(c => c.is_own);

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1440, margin: '0 auto' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {/* Page Header Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderRadius: 12, marginBottom: 24,
        background: '#0F1219',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Globe size={20} style={{ color: GOLD }} />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>Social Listening</h1>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>Competitive social intelligence</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleReanalyze}
            disabled={analyzing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: analyzing ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: '#FFFFFF', fontSize: 12, fontWeight: 600, cursor: analyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', opacity: analyzing ? 0.6 : 1,
            }}
            onMouseOver={e => { if (!analyzing) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={e => { if (!analyzing) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <RefreshCw size={13} style={analyzing ? { animation: 'spin 1s linear infinite' } : {}} />
            {analyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
          <div style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '4px 12px', borderRadius: 12,
            background: 'rgba(201, 168, 76, 0.2)', color: GOLD,
          }}>
            Complete
          </div>
        </div>
      </div>

      {/* ===== SECTION 1: Executive Pulse ===== */}
      {execSummary && (
        <>
          {/* Metric Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
            {/* Your Frequency */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: GOLD }} />
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary, marginTop: 4 }}>Your Frequency</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: token.colorText, marginTop: 8 }}>
                {ownCadence ? `${ownCadence.posts_per_week.toFixed(1)}/wk` : '--'}
              </div>
              <div style={{ fontSize: 12, color: token.colorTextTertiary, marginTop: 4 }}>
                {ownRank > 0 ? `Rank #${ownRank} of ${allCadenceSorted.length}` : '--'}
              </div>
            </div>
            {/* Top Competitor */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: token.colorPrimary }} />
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary, marginTop: 4 }}>Top Competitor</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: token.colorText, marginTop: 8 }}>
                {topCompetitorCadence?.company_name || '--'}
              </div>
              <div style={{ fontSize: 12, color: token.colorTextTertiary, marginTop: 4 }}>
                {topCompetitorCadence ? `${topCompetitorCadence.posts_per_week.toFixed(1)} posts/wk` : '--'}
              </div>
            </div>
            {/* Biggest Gap */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#ef4444' }} />
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary, marginTop: 4 }}>Biggest Gap</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: token.colorText, marginTop: 8 }}>
                {keyMetrics.biggest_theme_gap ? keyMetrics.biggest_theme_gap.split('(')[0].trim() : '--'}
              </div>
              <div style={{ fontSize: 12, color: token.colorTextTertiary, marginTop: 4 }}>
                {keyMetrics.biggest_theme_gap || '--'}
              </div>
            </div>
            {/* Category Sentiment */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ownReddit && ownReddit.score < 0 ? '#ef4444' : '#22c55e' }} />
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary, marginTop: 4 }}>Category Sentiment</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: ownReddit && ownReddit.score < 0 ? '#ef4444' : '#22c55e', marginTop: 8 }}>
                {ownReddit ? (ownReddit.score > 0 ? '+' : '') + ownReddit.score.toFixed(1) : '--'}
              </div>
              <div style={{ fontSize: 12, color: token.colorTextTertiary, marginTop: 4 }}>Reddit score</div>
            </div>
          </div>

          {/* Executive Summary Text */}
          <div style={{
            ...cardStyle,
            borderLeft: `3px solid ${GOLD}`,
            marginBottom: 0,
          }}>
            <div style={{ fontSize: 13, color: token.colorText, lineHeight: 1.7 }}>
              {execSummary.summary}
            </div>
            {insights.executive_summary?.generated_at && (
              <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 8 }}>
                Generated {timeAgo(insights.executive_summary.generated_at)}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== SECTION 2: Content Themes ===== */}
      {themesData && (
        <div style={{ marginTop: 40 }}>
          <div style={sectionCard('#3b82f6')}>
            <div style={sectionTitleStyle}>Content Themes</div>
            {(() => {
              const companies = themesData.companies || [];
              const allThemeKeys = [...new Set(companies.flatMap(c => Object.keys(c.themes || {})))]
                .sort((a, b) => {
                  if (a === 'other') return 1;
                  if (b === 'other') return -1;
                  return 0;
                });

              return (
                <>
                  <div style={{ ...innerCardStyle, padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr>
                            <th style={{
                              textAlign: 'left', padding: '14px 16px', fontSize: 11, fontWeight: 600,
                              textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary,
                              borderBottom: `2px solid ${token.colorBorderSecondary}`,
                              background: token.colorBgLayout || '#fafafa',
                            }}>Company</th>
                            <th style={{
                              textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 600,
                              textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary,
                              borderBottom: `2px solid ${token.colorBorderSecondary}`, whiteSpace: 'nowrap',
                              background: token.colorBgLayout || '#fafafa',
                            }}>Posts</th>
                            {allThemeKeys.map(tk => (
                              <th key={tk} style={{
                                textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary,
                                borderBottom: `2px solid ${token.colorBorderSecondary}`, whiteSpace: 'nowrap',
                                background: token.colorBgLayout || '#fafafa',
                              }}>{THEME_LABELS[tk] || tk}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((c, i) => {
                            const isOwn = c.is_own;
                            const totalPosts = c.total_posts || 0;
                            return (
                              <tr key={c.company_id || i} style={{ background: isOwn ? 'rgba(201, 168, 76, 0.08)' : 'white' }}>
                                <td style={{
                                  padding: '12px 16px', fontWeight: isOwn ? 700 : 500, color: token.colorText,
                                  borderBottom: `1px solid ${token.colorBorderSecondary}`, whiteSpace: 'nowrap',
                                  borderLeft: isOwn ? `3px solid ${GOLD}` : '3px solid transparent',
                                }}>
                                  <div>{c.company_name}{isOwn && <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, marginLeft: 8 }}>YOU</span>}</div>
                                  {c.sources && c.sources.length > 0 && <SourcePills sources={c.sources} token={token} />}
                                </td>
                                <td style={{
                                  padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: 13,
                                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                  color: totalPosts < 10 && totalPosts > 0 ? '#f59e0b' : token.colorText,
                                }}>
                                  {totalPosts || '--'}
                                  {totalPosts > 0 && totalPosts < 10 && (
                                    <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 500 }}>low sample</div>
                                  )}
                                </td>
                                {allThemeKeys.map(tk => {
                                  const pct = c.themes?.[tk] || 0;
                                  const count = totalPosts > 0 ? Math.round((pct / 100) * totalPosts) : 0;
                                  const { background, color } = heatmapBg(pct);
                                  return (
                                    <td key={tk} style={{
                                      padding: '10px 8px', textAlign: 'center', fontWeight: 600,
                                      borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                      background, color,
                                    }}>
                                      <div style={{ fontSize: 14 }}>{pct}%</div>
                                      {totalPosts > 0 && (
                                        <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginTop: 1 }}>
                                          {count} post{count !== 1 ? 's' : ''}
                                        </div>
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

                  {/* Theme Gaps */}
                  {(() => {
                    const gaps = (themesData.gaps || []).filter(g => g.own_pct < 10 && g.competitor_avg_pct > 30);
                    if (gaps.length === 0) return null;
                    return (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: token.colorText, marginBottom: 10 }}>Theme Gaps</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {gaps.map((g, i) => (
                            <div key={i} style={{ ...innerCardStyle, padding: '10px 14px' }}>
                              <span style={{
                                display: 'inline-block', fontSize: 12, fontWeight: 600, padding: '4px 12px',
                                borderRadius: 20, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                              }}>
                                {g.theme} — You: {g.own_pct}% vs Competitors: {g.competitor_avg_pct}%
                                {g.top_competitor && <span style={{ opacity: 0.8 }}> (led by {g.top_competitor} at {g.top_competitor_pct}%)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== SECTION 3: Engagement Scorecard ===== */}
      {engagementData && (
        <div style={{ marginTop: 40 }}>
          <div style={sectionCard('#C9A84C')}>
            <div style={sectionTitleStyle}>Engagement Scorecard</div>
            {(() => {
              const companies = engagementData.companies || [];
              const sorted = [...companies].sort((a, b) => b.engagement_per_post - a.engagement_per_post);
              const maxEng = Math.max(...sorted.map(c => c.engagement_per_post || 0), 1);

              return (
                <>
                  {/* Table */}
                  <div style={{ ...innerCardStyle, padding: 0, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr>
                            {['Company', 'Posts', 'Avg Likes', 'Avg Comments', 'Avg Shares', 'Eng/Post', 'Best Topic'].map((h, hi) => (
                              <th key={h} style={{
                                textAlign: hi === 0 || hi === 6 ? 'left' : 'right',
                                padding: '14px 16px', fontSize: 11, fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary,
                                borderBottom: `2px solid ${token.colorBorderSecondary}`, whiteSpace: 'nowrap',
                                background: token.colorBgLayout || '#fafafa',
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((c, i) => {
                            const isOwn = c.is_own;
                            return (
                              <tr key={c.company_id || i} style={{ background: isOwn ? 'rgba(201, 168, 76, 0.08)' : 'white' }}>
                                <td style={{
                                  padding: '12px 16px', fontWeight: isOwn ? 700 : 500, color: token.colorText,
                                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                  borderLeft: isOwn ? `3px solid ${GOLD}` : '3px solid transparent',
                                }}>
                                  {c.company_name}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 13, color: (c.post_count || 0) < 10 ? '#f59e0b' : token.colorTextSecondary, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.post_count || '--'}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14, color: token.colorText, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.avg_likes}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14, color: token.colorText, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.avg_comments}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14, color: token.colorText, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.avg_shares}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14, color: token.colorText, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.engagement_per_post}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: token.colorTextSecondary, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>{c.best_topic}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div style={innerCardStyle}>
                    {sorted.map((c, i) => {
                      const isOwn = c.is_own;
                      const pct = (c.engagement_per_post / maxEng) * 100;
                      return (
                        <div key={c.company_id || i}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                            borderBottom: i < sorted.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: token.colorText, width: 140, flexShrink: 0 }}>{c.company_name}</span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 24, borderRadius: 6, background: token.colorBorderSecondary, overflow: 'hidden' }}>
                                <div style={{
                                  width: `${pct}%`, height: '100%', borderRadius: 6,
                                  background: isOwn ? `linear-gradient(90deg, ${GOLD}, #d4b85c)` : `linear-gradient(90deg, ${token.colorPrimary}, ${token.colorPrimaryHover || token.colorPrimary})`,
                                  transition: 'width 0.3s ease',
                                }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: token.colorText, width: 40, textAlign: 'right', flexShrink: 0 }}>
                                {c.engagement_per_post}
                              </span>
                            </div>
                          </div>
                          <SourcePills sources={c.sources} token={token} />
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== SECTION 4: Posting Cadence ===== */}
      {cadenceData && (
        <div style={{ marginTop: 40 }}>
          <div style={sectionCard('#8b5cf6')}>
            <div style={sectionTitleStyle}>Posting Cadence</div>
            {(() => {
              const companies = cadenceData.companies || [];
              const sorted = [...companies].sort((a, b) => b.posts_per_week - a.posts_per_week);
              const maxPW = Math.max(...sorted.map(c => c.posts_per_week || 0), 1);
              const ownIndex = sorted.findIndex(c => c.is_own);
              const showWarning = ownIndex >= sorted.length - 2 && sorted.length > 2;

              return (
                <div style={innerCardStyle}>
                  {sorted.map((c, i) => {
                    const isOwn = c.is_own;
                    const platforms = c.platforms || {};
                    const tw = platforms.twitter?.per_week || 0;
                    const li = platforms.linkedin?.per_week || 0;
                    const rd = platforms.reddit?.per_week || 0;
                    const yt = platforms.youtube?.per_week || 0;
                    const total = tw + li + rd + yt;
                    const barWidth = (c.posts_per_week / maxPW) * 100;

                    return (
                      <div key={c.company_id || i}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                          borderBottom: i < sorted.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
                        }}>
                          <span style={{ fontSize: 13, fontWeight: isOwn ? 700 : 600, color: token.colorText, width: 140, flexShrink: 0 }}>
                            {c.company_name}
                            {isOwn && <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, marginLeft: 6 }}>YOU</span>}
                          </span>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 24, borderRadius: 6, background: token.colorBorderSecondary, overflow: 'hidden', display: 'flex', position: 'relative' }}>
                              {/* Stacked bar -- each platform fills proportionally within the total bar width */}
                              <div style={{ display: 'flex', width: `${barWidth}%`, height: '100%' }}>
                                {tw > 0 && (
                                  <div title={`Twitter: ${tw.toFixed(1)}/wk`} style={{
                                    width: `${(tw / total) * 100}%`, height: '100%',
                                    background: PLATFORM_COLORS.twitter,
                                    borderRight: total > tw ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                  }} />
                                )}
                                {li > 0 && (
                                  <div title={`LinkedIn: ${li.toFixed(1)}/wk`} style={{
                                    width: `${(li / total) * 100}%`, height: '100%',
                                    background: PLATFORM_COLORS.linkedin,
                                    borderRight: (rd > 0 || yt > 0) ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                  }} />
                                )}
                                {rd > 0 && (
                                  <div title={`Reddit: ${rd.toFixed(1)}/wk`} style={{
                                    width: `${(rd / total) * 100}%`, height: '100%',
                                    background: PLATFORM_COLORS.reddit,
                                    borderRight: yt > 0 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                  }} />
                                )}
                                {yt > 0 && (
                                  <div title={`YouTube: ${yt.toFixed(1)}/wk`} style={{
                                    width: `${(yt / total) * 100}%`, height: '100%',
                                    background: PLATFORM_COLORS.youtube,
                                  }} />
                                )}
                              </div>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: token.colorText, width: 80, textAlign: 'right', flexShrink: 0 }}>
                              {c.posts_per_week.toFixed(1)}/wk
                            </span>
                          </div>
                        </div>
                        <SourcePills sources={c.sources} token={token} />
                      </div>
                    );
                  })}

                  {/* Platform legend */}
                  <div style={{ display: 'flex', gap: 20, fontSize: 11, color: token.colorTextSecondary, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
                    {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
                      <span key={platform} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <PlatformIcon platform={platform} size={12} />
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: color }} />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    ))}
                  </div>

                  {showWarning && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginTop: 16,
                      padding: '12px 16px', borderRadius: 8,
                      background: 'rgba(250, 173, 20, 0.08)', border: '1px solid rgba(250, 173, 20, 0.25)',
                    }}>
                      <AlertTriangle size={14} style={{ color: '#faad14', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#b8860b', fontWeight: 600 }}>You're being outpaced</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== SECTION 5: Reddit Pulse ===== */}
      {redditData && (() => {
        // Filter out companies with 0 posts
        const activeCompanies = (redditData.companies || []).filter(c => c.post_count > 0);
        if (activeCompanies.length === 0) return null;

        return (
          <div style={{ marginTop: 40 }}>
            <div style={sectionCard('#FF4500')}>
              <div style={{ ...sectionTitleStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlatformIcon platform="reddit" size={20} />
                Reddit Pulse
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {activeCompanies.map((c, i) => {
                  const isOwn = c.is_own;
                  return (
                    <div key={c.company_id || i} style={{
                      ...innerCardStyle,
                      border: isOwn ? `2px solid ${GOLD}` : `1px solid ${token.colorBorderSecondary}`,
                      background: isOwn ? 'rgba(201, 168, 76, 0.04)' : 'white',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <CompanyLogo name={c.company_name} size={22} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: token.colorText }}>
                          {c.company_name}
                        </span>
                        {isOwn && <span style={{ fontSize: 10, fontWeight: 700, color: GOLD }}>YOU</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <SentimentDonut positive={c.positive_pct} neutral={c.neutral_pct} negative={c.negative_pct} />
                        <div>
                          <div style={{
                            fontSize: 28, fontWeight: 700,
                            color: c.score > 0 ? '#22c55e' : c.score < 0 ? '#ef4444' : token.colorText,
                          }}>
                            {c.score > 0 ? '+' : ''}{c.score.toFixed(1)}
                          </div>
                          <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 2 }}>
                            {c.post_count} posts
                          </div>
                        </div>
                      </div>

                      {/* Sentiment bar */}
                      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 12, gap: 2 }}>
                        <div style={{ width: `${c.positive_pct}%`, background: '#22c55e', borderRadius: 3 }} />
                        <div style={{ width: `${c.neutral_pct}%`, background: '#9ca3af', borderRadius: 3 }} />
                        <div style={{ width: `${c.negative_pct}%`, background: '#ef4444', borderRadius: 3 }} />
                      </div>

                      {/* Sentiment legend */}
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: token.colorTextSecondary, marginTop: 8 }}>
                        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 4, verticalAlign: 'middle' }} />{c.positive_pct}% pos</span>
                        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', marginRight: 4, verticalAlign: 'middle' }} />{c.neutral_pct}% neu</span>
                        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginRight: 4, verticalAlign: 'middle' }} />{c.negative_pct}% neg</span>
                      </div>

                      {/* Pain points */}
                      {c.pain_points && c.pain_points.length > 0 && (
                        <div style={{ marginTop: 14, borderTop: `1px solid ${token.colorBorderSecondary}`, paddingTop: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: token.colorTextSecondary, marginBottom: 6 }}>Pain Points</div>
                          {c.pain_points.slice(0, 3).map((pp, pi) => (
                            <div key={pi} style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.8 }}>
                              • {pp}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reddit source links */}
                      <SourcePills sources={c.sources} token={token} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
