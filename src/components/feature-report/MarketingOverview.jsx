import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Search, BarChart3, FileText, Globe, Target } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

/* ─── helpers ─── */
const fmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const trendIcon = (trend) => {
  if (!trend) return null;
  const t = trend.toLowerCase();
  if (t === 'up' || t === 'growing' || t === 'ahead') return <TrendingUp size={13} style={{ color: '#059669' }} />;
  if (t === 'down' || t === 'declining' || t === 'behind') return <TrendingDown size={13} style={{ color: '#DC2626' }} />;
  return <Minus size={13} style={{ color: '#6B7280' }} />;
};

/* Consistent color system across the whole page */
const STATUS = {
  ahead:   { bg: '#D1FAE5', color: '#065F46', border: '#059669', label: 'Ahead' },
  leading: { bg: '#D1FAE5', color: '#065F46', border: '#059669', label: 'Leading' },
  on_par:  { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF', label: 'On Par' },
  behind:  { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626', label: 'Behind' },
  gap:     { bg: '#FEE2E2', color: '#DC2626', border: '#DC2626', label: 'Gap' },
  growing: { bg: '#FEF3C7', color: '#92400E', border: '#D97706', label: 'Growing' },
  no_data: { bg: '#F3F4F6', color: '#9CA3AF', border: '#9CA3AF', label: 'No Data' },
};

const PRIORITY = {
  critical: { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626' },
  high:     { bg: '#FEF3C7', color: '#92400E', border: '#D97706' },
  medium:   { bg: '#DBEAFE', color: '#1E40AF', border: '#2563EB' },
  low:      { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' },
};

const CHANNEL = {
  'Content':           { bg: '#DBEAFE', color: '#1E40AF', icon: <FileText size={14} /> },
  'Organic / SEO':     { bg: '#D1FAE5', color: '#065F46', icon: <Search size={14} /> },
  'Paid Ads':          { bg: '#FEF3C7', color: '#92400E', icon: <Target size={14} /> },
  'AI Engines (AEO)':  { bg: '#F3E8FF', color: '#6B21A8', icon: <Globe size={14} /> },
  'AEO':               { bg: '#F3E8FF', color: '#6B21A8', icon: <Globe size={14} /> },
};

const statusBadge = (status) => {
  const s = STATUS[status] || STATUS.no_data;
  return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>;
};

const priorityBadge = (priority) => {
  const p = PRIORITY[priority] || PRIORITY.medium;
  return <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700, background: p.bg, color: p.color, border: `1px solid ${p.border}`, textTransform: 'uppercase' }}>{priority}</span>;
};

const channelBadge = (channel) => {
  const c = CHANNEL[channel] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' };
  return <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.68rem', fontWeight: 600, background: c.bg, color: c.color }}>{channel}</span>;
};


/* ═══════════════════════════════════════════════════════════════
   1. MARKETING SCORECARD — one row per competitor, all channels
   Data sourced from: Content Intel, Traffic & SEO, Paid Channels, AEO
   ═══════════════════════════════════════════════════════════════ */
function MarketingScorecard({ competitors, logoMap }) {
  if (!competitors || competitors.length === 0) return null;

  // Compute rank per metric to color-code cells
  const metrics = ['content_30d', 'organic_traffic', 'da', 'organic_keywords', 'active_ads', 'paid_keywords'];
  const youIdx = competitors.findIndex(c => c.is_you);
  const ranks = {};
  metrics.forEach(m => {
    const vals = competitors.map(c => c[m] || 0);
    const sorted = [...vals].sort((a, b) => b - a);
    ranks[m] = vals.map(v => sorted.indexOf(v) + 1);
  });

  const rankStyle = (metric, idx) => {
    const rank = ranks[metric]?.[idx];
    const total = competitors.length;
    if (idx !== youIdx) return { fontWeight: 600, color: 'var(--gray-600)' };
    // Only color-code YOUR row
    if (rank === 1) return { fontWeight: 800, color: '#065F46', background: '#D1FAE5' };
    if (rank === 2) return { fontWeight: 700, color: '#065F46' };
    if (rank >= total - 1) return { fontWeight: 700, color: '#991B1B', background: '#FEE2E2' };
    return { fontWeight: 600, color: 'var(--gray-700)' };
  };

  const thStyle = { textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Marketing Scorecard</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>
        How you stack up across all marketing channels — green = you lead, red = you trail
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Company</th>
              <th style={thStyle}>Content (30d)</th>
              <th style={thStyle}>Organic Traffic</th>
              <th style={thStyle}>DA</th>
              <th style={thStyle}>Keywords</th>
              <th style={thStyle}>Active Ads</th>
              <th style={thStyle}>Paid KWs</th>
              <th style={thStyle}>AI Visibility</th>
              <th style={thStyle}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((comp, i) => {
              const isYou = comp.is_you;
              const s = STATUS[comp.overall_signal] || STATUS.no_data;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: isYou ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CompanyLogo name={comp.name} logoUrl={logoMap[comp.name]} size={20} />
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{comp.name}</span>
                      {isYou && <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: 'var(--azure)', color: '#fff' }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('content_30d', i) }}>{comp.content_30d ?? '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('organic_traffic', i) }}>{comp.organic_traffic ? `~${fmt(comp.organic_traffic)}` : '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('da', i) }}>{comp.da ?? '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('organic_keywords', i) }}>{comp.organic_keywords ? fmt(comp.organic_keywords) : '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('active_ads', i) }}>{comp.active_ads ?? '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', borderRadius: 4, ...rankStyle('paid_keywords', i) }}>{comp.paid_keywords ? fmt(comp.paid_keywords) : '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: 'var(--gray-700)' }}>{comp.ai_visibility ?? '—'}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: s.bg, color: s.color }}>
                      {trendIcon(comp.overall_signal)} {s.label}
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
   2. CHANNEL COMPARISON — per-channel status heatmap
   ═══════════════════════════════════════════════════════════════ */
function ChannelComparison({ channels }) {
  if (!channels || channels.length === 0) return null;

  const tabRoutes = {
    'Content': '/content-intel',
    'Organic / SEO': '/website-traffic',
    'Paid Ads': '/paid-channels',
    'AI Engines (AEO)': '/aeo',
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Channel-by-Channel Status</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Click any channel to dive deeper</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {channels.map((ch, i) => {
          const st = STATUS[ch.status] || STATUS.no_data;
          const cc = CHANNEL[ch.channel] || { bg: 'var(--gray-100)', color: 'var(--gray-600)', icon: <BarChart3 size={14} /> };
          const route = tabRoutes[ch.channel];
          return (
            <div key={i}
              onClick={() => { if (route) window.location.pathname = route; }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 8,
                border: '1px solid var(--gray-200)', borderLeft: `4px solid ${st.border}`,
                background: '#fff', cursor: route ? 'pointer' : 'default',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (route) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Channel + status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
                <span style={{ color: cc.color }}>{cc.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.85rem' }}>{ch.channel}</span>
                {statusBadge(ch.status)}
              </div>

              {/* Full insight — no truncation */}
              <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                {ch.summary}
              </div>

              {/* Arrow */}
              {route && <span style={{ color: 'var(--gray-300)', flexShrink: 0, fontSize: '1.1rem' }}>→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   3. CONSOLIDATED GAPS — all gaps across channels, prioritized
   ═══════════════════════════════════════════════════════════════ */
function ConsolidatedGaps({ gaps }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <h3 className="section-title" style={{ marginBottom: 4 }}>Marketing Gaps</h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>All gaps across channels — sorted by priority</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 70 }}>Priority</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 110 }}>Channel</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Gap</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Who Owns It</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap, i) => {
              const p = PRIORITY[gap.priority] || PRIORITY.medium;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', borderLeft: `3px solid ${p.border}` }}>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    {priorityBadge(gap.priority)}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    {channelBadge(gap.channel)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--navy)' }}>{gap.description}</td>
                  <td style={{ padding: '12px', color: 'var(--gray-600)' }}>{gap.owned_by}</td>
                  <td style={{ padding: '12px', color: 'var(--gray-600)', fontSize: '0.78rem' }}>{gap.impact}</td>
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
   4. CROSS-CHANNEL AI INSIGHTS — patterns across channels
   This is the "so what" that no team sees individually
   ═══════════════════════════════════════════════════════════════ */
function CrossChannelInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 className="section-title" style={{ margin: 0 }}>Cross-Channel Intelligence</h3>
        <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>AI-Generated</span>
      </div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: 18 }}>Patterns spanning multiple channels — insights individual teams can't see in isolation</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 120 }}>Channels</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Insight</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: '35%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((ins, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', verticalAlign: 'top' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {ins.channels?.map((ch, ci) => {
                      const cc = CHANNEL[ch] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' };
                      return (
                        <span key={ci} style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: cc.bg, color: cc.color, textTransform: 'uppercase', width: 'fit-content' }}>{ch}</span>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: 4 }}>{ins.pattern}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', lineHeight: 1.4 }}>{ins.evidence}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.4 }}>{ins.recommendation}</div>
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
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function MarketingOverview({ data, meta }) {
  const logoMap = {};
  if (meta?.main_company) logoMap[meta.main_company.name] = meta.main_company.logo_url;
  (meta?.competitors || []).forEach(c => { logoMap[c.name] = c.logo_url; });

  return (
    <div>
      <MarketingScorecard competitors={data?.scorecard} logoMap={logoMap} />
      <ChannelComparison channels={data?.channels} />
      <ConsolidatedGaps gaps={data?.gaps} />
      <CrossChannelInsights insights={data?.cross_channel_insights} />
    </div>
  );
}
