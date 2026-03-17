import { useState, useEffect } from 'react';
import { Table, Tag, Spin, Empty, Badge, Tooltip, theme } from 'antd';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target, BarChart3, Briefcase, Eye, Zap, Shield, Users, Activity, ChevronRight } from 'lucide-react';
import { intelApi } from '../services/api';

// ─── Design Tokens ──────────────────────────────────────
const SEV_COLOR = { Critical: '#DC2626', High: '#F59E0B', Medium: '#3B82F6', Low: '#6B7280', Informational: '#9CA3AF' };
const PERF_COLOR = { outperform: '#059669', inline: '#3B82F6', underperform: '#DC2626' };
const BADGE_COLOR = { disconnect: '#DC2626', stealth: '#C9A84C', aligned: '#059669' };
const STAGE_COLOR = { Identified: 'blue', Qualified: 'green', Qualify: 'orange', Outreach: 'purple' };
const URGENCY_COLOR = { high: '#DC2626', medium: '#F59E0B', watch: '#3B82F6' };
const SIGNAL_TYPE_COLOR = { performance: '#DC2626', transition: '#7C3AED', friction: '#F59E0B', ecosystem: '#3B82F6' };
const MOVE_TYPE_COLOR = { 'M&A': '#7C3AED', Product: '#3B82F6', Capacity: '#059669', Distribution: '#F59E0B', Partnership: '#06B6D4', 'PLI/Govt': '#8B5CF6', Pricing: '#DC2626', Digital: '#3B82F6', Leadership: '#EC4899', Risk: '#DC2626' };
const QUADRANT = { 'Margin Inflection': { color: '#059669', icon: '↑' }, Stress: { color: '#DC2626', icon: '↓' }, Consolidation: { color: '#3B82F6', icon: '■' }, Fundraise: { color: '#F59E0B', icon: '↑' } };

// ─── Shared Components ──────────────────────────────────

function PageHeader({ title, subtitle, tag }) {
  const { token } = theme.useToken();
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: token.colorText }}>{title}</h1>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: token.colorTextSecondary }}>{subtitle}</p>}
      {tag && <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, padding: '2px 10px', borderRadius: 4, background: token.colorPrimaryBg, color: token.colorPrimary, fontWeight: 500 }}>{tag}</span>}
    </div>
  );
}

function SubHeader({ children, description }) {
  const { token } = theme.useToken();
  return (
    <div style={{ marginTop: 28, marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: token.colorText, borderLeft: `3px solid ${token.colorPrimary}`, paddingLeft: 12 }}>{children}</h3>
      {description && <p style={{ margin: '2px 0 0 15px', fontSize: 12, color: token.colorTextTertiary }}>{description}</p>}
    </div>
  );
}

function Card({ children, style, accent }) {
  const { token } = theme.useToken();
  return (
    <div style={{
      background: token.colorBgContainer, borderRadius: 10, padding: 20,
      border: `1px solid ${token.colorBorderSecondary}`,
      ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
      ...style,
    }}>{children}</div>
  );
}

function StatBox({ value, label, color }) {
  const { token } = theme.useToken();
  return (
    <div style={{ textAlign: 'center', padding: '12px 16px', background: token.colorBgElevated, borderRadius: 8, border: `1px solid ${token.colorBorder}`, minWidth: 100 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || token.colorPrimary, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: token.colorTextSecondary, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SeverityDots({ score, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i < score ? (score >= 4 ? '#DC2626' : score >= 3 ? '#F59E0B' : '#059669') : 'rgba(255,255,255,0.1)',
        }} />
      ))}
    </span>
  );
}

function SourceBadge({ tier = 'Verified', text }) {
  const colors = { Verified: '#059669', Guidance: '#F59E0B', Estimated: '#F59E0B', Derived: '#3B82F6' };
  const { token } = theme.useToken();
  return (
    <span style={{ fontSize: 10, color: token.colorTextTertiary }}>
      <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 3, background: `${colors[tier] || '#6B7280'}22`, color: colors[tier] || '#6B7280', fontWeight: 600, fontSize: 9, marginRight: 4, textTransform: 'uppercase' }}>{tier}</span>
      {text}
    </span>
  );
}

function CompanyPill({ name, metric }) {
  const { token } = theme.useToken();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 5,
      background: token.colorBgElevated, border: `1px solid ${token.colorBorder}`, marginRight: 6, marginBottom: 4, fontSize: 11, cursor: 'default',
    }}>
      <span style={{ fontWeight: 600, color: token.colorText }}>{name}</span>
      {metric && <span style={{ color: token.colorTextSecondary, fontSize: 10 }}>{metric}</span>}
    </span>
  );
}

function SignalTypeBadge({ type }) {
  return <Tag color={SIGNAL_TYPE_COLOR[type] || '#6B7280'} style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>{type}</Tag>;
}

function TrendIcon({ direction, size = 14 }) {
  if (direction === 'up') return <TrendingUp size={size} color="#059669" />;
  if (direction === 'down') return <TrendingDown size={size} color="#DC2626" />;
  return <Minus size={size} color="#6B7280" />;
}

// ─── Executive Snapshot ──────────────────────────────────
export function ExecutiveSnapshotPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  useEffect(() => { intelApi.executiveSnapshot().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data) return <Empty description="No data available" />;

  const companies = data.companies || [];
  const urgencies = ['all', 'high', 'medium', 'watch'];
  const filtered = urgencyFilter === 'all' ? companies : companies.filter(c => c.signal_taxonomy?.[0]?.urgency === urgencyFilter);

  return (
    <div>
      <PageHeader
        title="Executive Snapshot"
        subtitle="Signal-driven engagement pipeline — prioritized by urgency, signal taxonomy, and service fit"
        tag={`Q3 FY26 · ${companies.length} Companies · 14 Intelligence Reports`}
      />

      {/* Engagement-Ready Signals */}
      <SubHeader description="Signal cards prioritized by urgency and signal taxonomy">Engagement-Ready Signals</SubHeader>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {urgencies.map(u => (
          <Tag key={u} style={{ cursor: 'pointer', fontSize: 12, fontWeight: urgencyFilter === u ? 600 : 400 }}
               color={urgencyFilter === u ? (URGENCY_COLOR[u] || token.colorPrimary) : undefined}
               onClick={() => setUrgencyFilter(u)}>
            {u === 'all' ? `All (${companies.length})` : `${u.charAt(0).toUpperCase() + u.slice(1)} (${companies.filter(c => c.signal_taxonomy?.[0]?.urgency === u).length})`}
          </Tag>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12, marginBottom: 32 }}>
        {filtered.map(c => {
          const tax = c.signal_taxonomy?.[0];
          return (
            <Card key={c.id} accent={SIGNAL_TYPE_COLOR[tax?.primary_type]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: token.colorText }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: token.colorTextTertiary }}>{c.sub_sector} · {c.ticker}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Tag color={PERF_COLOR[c.perf]} style={{ fontSize: 10, margin: 0 }}>{c.perf}</Tag>
                  {tax?.urgency && <Tag color={URGENCY_COLOR[tax.urgency]} style={{ fontSize: 9, margin: 0 }}>{tax.urgency}</Tag>}
                </div>
              </div>
              {tax && (
                <>
                  <SignalTypeBadge type={tax.primary_type} />
                  <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 8, lineHeight: 1.6 }}>
                    {(tax.signals || []).join(' · ')}
                  </div>
                  {tax.thesis_situation && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: token.colorBgElevated, borderRadius: 6, borderLeft: `2px solid ${token.colorPrimary}` }}>
                      <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.5 }}>
                        <strong style={{ color: token.colorText }}>Situation:</strong> {tax.thesis_situation}
                      </div>
                      {tax.thesis_complication && (
                        <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.5, marginTop: 4 }}>
                          <strong style={{ color: token.colorText }}>Complication:</strong> {tax.thesis_complication}
                        </div>
                      )}
                      {tax.thesis_implication && (
                        <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.5, marginTop: 4 }}>
                          <strong style={{ color: token.colorText }}>Implication:</strong> {tax.thesis_implication}
                        </div>
                      )}
                    </div>
                  )}
                  {tax.service_lines?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {tax.service_lines.map(s => <Tag key={s} style={{ fontSize: 10, marginBottom: 2 }}>{s}</Tag>)}
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Sector Themes & Red Flags — Two Column */}
      <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: 8, paddingTop: 8 }} />
      <SubHeader description="Cross-cutting patterns across the company universe, with evidence links">Sector Themes & Red Flags</SubHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16, marginBottom: 32 }}>
        {/* Big Themes */}
        <Card>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: token.colorText }}>Big Themes</h3>
          {(data.themes || []).map(t => (
            <div key={t.id} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: token.colorText, marginBottom: 6 }}>{t.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {(t.theme_evidence || []).map((e, i) => (
                  <CompanyPill key={i} name={e.companies?.name} metric={e.metric} />
                ))}
              </div>
            </div>
          ))}
          <SourceBadge tier="Verified" text="Q3 FY26 Earnings Transcripts, Annual Reports FY25, BSE Filings" />
        </Card>

        {/* Red Flags */}
        <Card>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: token.colorText }}>
            Red Flags <Tag color="red" style={{ fontSize: 10, verticalAlign: 'middle' }}>Monitor</Tag>
          </h3>
          {(data.red_flags || []).map((rf, i) => (
            <div key={rf.id || i} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: token.colorText }}>{rf.indicator}</span>
                <SeverityDots score={rf.severity === 'Critical' ? 5 : rf.severity === 'High' ? 4 : 3} />
              </div>
              <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.5, marginBottom: 6 }}>{rf.signal}</div>
              <CompanyPill name={rf.companies?.name} />
            </div>
          ))}
          <SourceBadge tier="Verified" text="Q3 FY26 Results, BSE Board Outcomes, Annual Reports FY25" />
        </Card>
      </div>

      {/* Talk vs Walk — Narrative Disconnects */}
      {data.talk_vs_walk?.length > 0 && (
        <>
          <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: 8, paddingTop: 8 }} />
          <SubHeader description="Where management narrative diverges from financial reality">Talk vs Walk — Narrative Disconnects</SubHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {data.talk_vs_walk.map(tvw => (
              <Card key={tvw.id} accent={BADGE_COLOR[tvw.badge]}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{tvw.companies?.name}</span>
                  <Tag color={BADGE_COLOR[tvw.badge]} style={{ fontSize: 10, textTransform: 'uppercase' }}>{tvw.badge}</Tag>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: token.colorTextTertiary, marginBottom: 4 }}>Management Says</div>
                    <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{tvw.management_says}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: token.colorTextTertiary, marginBottom: 4 }}>Data Shows</div>
                    <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{tvw.data_shows}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Earnings Grid */}
      {data.earnings_grid?.length > 0 && (
        <>
          <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: 8, paddingTop: 8 }} />
          <SubHeader description="Latest quarterly snapshot across tracked companies">Earnings Snapshot</SubHeader>
          <Card>
            <Table
              dataSource={data.earnings_grid}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: 900 }}
              columns={[
                { title: 'Company', key: 'company', width: 160, render: (_, r) => <span style={{ fontWeight: 600 }}>{r.companies?.name}</span> },
                { title: 'Sub-Sector', key: 'sub', width: 100, render: (_, r) => <Tag style={{ fontSize: 10 }}>{r.companies?.sub_sector}</Tag> },
                { title: 'Period', key: 'period', width: 90, render: (_, r) => `${r.quarter || 'FY'} ${r.fiscal_year}` },
                { title: 'Revenue (Cr)', dataIndex: 'revenue', key: 'rev', width: 110, render: v => v != null ? Number(v).toLocaleString('en-IN') : '-' },
                { title: 'EBITDA %', dataIndex: 'ebitda_pct', key: 'ebitda', width: 80, render: v => v != null ? `${Number(v).toFixed(1)}%` : '-' },
                { title: 'Rev Growth', dataIndex: 'rev_growth', key: 'rg', width: 100, render: v => v != null ? <span style={{ color: v >= 0 ? '#059669' : '#DC2626', fontFamily: 'monospace' }}>{v >= 0 ? '+' : ''}{Number(v).toFixed(1)}%</span> : '-' },
                { title: 'PAT (Cr)', dataIndex: 'pat', key: 'pat', width: 100, render: v => v != null ? Number(v).toLocaleString('en-IN') : '-' },
                { title: 'ROCE', dataIndex: 'roce', key: 'roce', width: 70, render: v => v != null ? `${Number(v).toFixed(1)}%` : '-' },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}

// ─── Market Pulse ────────────────────────────────────────
export function MarketPulsePage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { intelApi.marketPulse().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data?.length) return <Empty description="No data available" />;

  // Group by badge_label category
  const grouped = {};
  for (const item of data) {
    const cat = item.badge_label || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  return (
    <div>
      <PageHeader
        title="Market Pulse"
        subtitle="Macro context for BD opportunity identification — demand signals, input costs, and policy landscape"
        tag="Feb 2026 · Demand, Costs & Channels"
      />
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <SubHeader>{cat}</SubHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {items.map(item => (
              <Card key={item.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Tag color={item.badge_color} style={{ fontSize: 10, fontWeight: 600 }}>{item.badge_label}</Tag>
                  <TrendIcon direction={item.direction} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: token.colorText, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: token.colorPrimary, marginBottom: 8, fontFamily: 'monospace' }}>{item.headline_value}</div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{item.detail}</div>
                {item.cost_change && <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 6 }}>Cost change: {item.cost_change}</div>}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Financial Performance ───────────────────────────────
export function FinancialPerformancePage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDerived, setShowDerived] = useState(false);
  useEffect(() => { intelApi.financialPerformance().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data) return <Empty description="No data available" />;

  const latestByCompany = {};
  for (const fp of data.financial_periods || []) {
    if (!latestByCompany[fp.company_id]) latestByCompany[fp.company_id] = fp;
  }
  const rows = Object.values(latestByCompany);

  const baseColumns = [
    { title: 'Signal', key: 'signal', width: 80, fixed: 'left', render: (_, r) => <Tag color={PERF_COLOR[r.companies?.perf]} style={{ fontSize: 10 }}>{r.companies?.am_signal || r.companies?.perf}</Tag> },
    { title: 'Company', key: 'company', width: 160, fixed: 'left', render: (_, r) => <span style={{ fontWeight: 600 }}>{r.companies?.name}</span> },
    { title: 'Sub-Sector', key: 'sub', width: 110, render: (_, r) => <Tag style={{ fontSize: 10 }}>{r.companies?.sub_sector}</Tag> },
    { title: 'Period', key: 'period', width: 90, render: (_, r) => `${r.quarter || 'FY'} ${r.fiscal_year}` },
    { title: 'Revenue (Cr)', dataIndex: 'revenue', key: 'rev', width: 120, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toLocaleString('en-IN')}</span> : '-' },
    { title: 'YoY Growth', dataIndex: 'rev_growth', key: 'rg', width: 100, render: v => v != null ? <span style={{ color: v >= 0 ? '#059669' : '#DC2626', fontFamily: 'monospace', fontWeight: 600 }}>{v >= 0 ? '+' : ''}{Number(v).toFixed(1)}%</span> : '-' },
    { title: 'EBITDA %', dataIndex: 'ebitda_pct', key: 'ebitda', width: 90, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toFixed(1)}%</span> : '-' },
    { title: 'WC Days', dataIndex: 'wc_days', key: 'wc', width: 80, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{v}</span> : '-' },
    { title: 'Inv Days', dataIndex: 'inv_days', key: 'inv', width: 80, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{v}</span> : '-' },
    { title: 'D/E', dataIndex: 'de', key: 'de', width: 70, render: v => v != null ? <span style={{ fontFamily: 'monospace', color: v > 1 ? '#DC2626' : '#059669' }}>{Number(v).toFixed(2)}</span> : '-' },
    { title: 'ROCE %', dataIndex: 'roce', key: 'roce', width: 80, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toFixed(1)}%</span> : '-' },
  ];

  const derivedColumns = [
    { title: 'P/E', dataIndex: 'pe', key: 'pe', width: 70, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toFixed(1)}</span> : '-' },
    { title: 'PAT (Cr)', dataIndex: 'pat', key: 'pat', width: 100, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toLocaleString('en-IN')}</span> : '-' },
    { title: 'Debtor Days', dataIndex: 'debtor_days', key: 'dd', width: 90, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{v}</span> : '-' },
    { title: 'CCC', dataIndex: 'ccc', key: 'ccc', width: 70, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{v}</span> : '-' },
  ];

  return (
    <div>
      <PageHeader
        title="Financial Performance"
        subtitle="Quarterly financial benchmarking across tracked companies"
        tag="Q3 FY26 · Sortable Metrics"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Tag style={{ cursor: 'pointer', fontSize: 12 }} color={showDerived ? token.colorPrimary : undefined}
             onClick={() => setShowDerived(!showDerived)}>
          {showDerived ? 'Hide' : 'Show'} Additional Metrics
        </Tag>
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Table
          dataSource={rows}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ x: showDerived ? 1400 : 1100 }}
          columns={showDerived ? [...baseColumns, ...derivedColumns] : baseColumns}
        />
      </Card>
    </div>
  );
}

// ─── Transcript Intel ────────────────────────────────────
export function TranscriptIntelPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCompany, setActiveCompany] = useState(null);
  const [sevFilter, setSevFilter] = useState('All');
  useEffect(() => { intelApi.transcriptIntel().then(r => { setData(r.data); if (r.data?.by_company?.length) setActiveCompany(r.data.by_company[0].company_id); }).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data) return <Empty description="No data available" />;

  const companyData = data.by_company?.find(c => c.company_id === activeCompany);
  const sevFilters = ['All', 'Critical', 'High', 'Medium', 'Low', 'Informational'];
  const filteredSignals = sevFilter === 'All' ? (companyData?.signals || []) : (companyData?.signals || []).filter(s => s.severity === sevFilter);

  return (
    <div>
      <PageHeader
        title="Transcript Intel"
        subtitle="Earnings call and annual report analysis — signal extraction with evidence"
        tag={`${data.stats?.total || 0} Signals · ${data.stats?.company_count || 0} Companies`}
      />

      {/* Severity summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(data.stats?.by_severity || {}).map(([sev, count]) => (
          <StatBox key={sev} value={count} label={sev} color={SEV_COLOR[sev]} />
        ))}
      </div>

      {/* Company sidebar + signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        {/* Company list */}
        <Card style={{ padding: 8, maxHeight: 600, overflowY: 'auto' }}>
          {(data.by_company || []).map(c => {
            const isActive = c.company_id === activeCompany;
            const critCount = c.signals.filter(s => s.severity === 'Critical' || s.severity === 'High').length;
            return (
              <div key={c.company_id} onClick={() => { setActiveCompany(c.company_id); setSevFilter('All'); }}
                style={{
                  padding: '10px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 2,
                  background: isActive ? token.colorPrimaryBg : 'transparent',
                  color: isActive ? token.colorPrimary : token.colorText,
                  fontWeight: isActive ? 600 : 400, fontSize: 13,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                <span>{c.company?.name || c.company_id}</span>
                {critCount > 0 && <Badge count={critCount} size="small" color="#DC2626" />}
              </div>
            );
          })}
        </Card>

        {/* Signals for selected company */}
        <div>
          {companyData && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {sevFilters.map(s => (
                  <Tag key={s} style={{ cursor: 'pointer', fontSize: 11 }} color={sevFilter === s ? (SEV_COLOR[s] || token.colorPrimary) : undefined}
                       onClick={() => setSevFilter(s)}>{s}</Tag>
                ))}
              </div>
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table
                  dataSource={filteredSignals}
                  rowKey="id"
                  size="small"
                  pagination={{ pageSize: 12 }}
                  scroll={{ x: 900 }}
                  columns={[
                    { title: '#', dataIndex: 'rank', key: 'rank', width: 40 },
                    { title: 'Severity', dataIndex: 'severity', key: 'sev', width: 90, render: v => <Tag color={SEV_COLOR[v]} style={{ fontSize: 10 }}>{v}</Tag> },
                    { title: 'Indicator', dataIndex: 'indicator', key: 'indicator', width: 160 },
                    { title: 'Signal & Rationale', key: 'signal', render: (_, r) => (
                      <div>
                        <div style={{ fontSize: 12, color: token.colorText }}>{r.signal}</div>
                        {r.rationale && <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 2 }}>{r.rationale}</div>}
                      </div>
                    )},
                    { title: 'Status', dataIndex: 'status', key: 'status', width: 90, render: v => <Tag color={v === 'Positive' ? 'green' : v === 'Negative' ? 'red' : v === 'Critical Risk' ? 'red' : 'orange'} style={{ fontSize: 10 }}>{v}</Tag> },
                    { title: 'Confidence', dataIndex: 'confidence', key: 'conf', width: 80, render: v => <Tag style={{ fontSize: 10 }}>{v}</Tag> },
                  ]}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Deals & Transactions ────────────────────────────────
export function DealsPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  useEffect(() => { intelApi.deals().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data?.length) return <Empty description="No deals found" />;

  const types = ['All', ...new Set(data.map(d => d.deal_type).filter(Boolean))];
  const filtered = typeFilter === 'All' ? data : data.filter(d => d.deal_type === typeFilter);

  return (
    <div>
      <PageHeader
        title="Deals & Transactions"
        subtitle="M&A activity, investments, and strategic transactions with advisory angles"
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatBox value={data.length} label="Total Deals" />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {types.map(t => (
          <Tag key={t} style={{ cursor: 'pointer', fontSize: 12 }} color={typeFilter === t ? token.colorPrimary : undefined}
               onClick={() => setTypeFilter(t)}>
            {t} ({t === 'All' ? data.length : data.filter(d => d.deal_type === t).length})
          </Tag>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {filtered.map(deal => (
          <Card key={deal.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{deal.companies?.name || deal.company_name}</span>
              <Tag color={MOVE_TYPE_COLOR[deal.deal_type] || '#6B7280'} style={{ fontSize: 10 }}>{deal.deal_type}</Tag>
            </div>
            <div style={{ fontWeight: 500, fontSize: 13, color: token.colorText, marginBottom: 6 }}>{deal.title}</div>
            {deal.value_cr && <div style={{ fontSize: 13, fontWeight: 600, color: token.colorPrimary, fontFamily: 'monospace', marginBottom: 6 }}>₹{Number(deal.value_cr).toLocaleString('en-IN')} Cr</div>}
            {deal.deal_date && <div style={{ fontSize: 11, color: token.colorTextTertiary, marginBottom: 4 }}>{new Date(deal.deal_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
            {deal.source && <SourceBadge tier="Verified" text={deal.source} />}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Competitive Moves ───────────────────────────────────
export function CompetitiveMovesPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  useEffect(() => { intelApi.competitive().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data?.length) return <Empty description="No competitive moves found" />;

  const types = ['All', ...new Set(data.map(d => d.move_type).filter(Boolean))];
  const filtered = typeFilter === 'All' ? data : data.filter(d => d.move_type === typeFilter);

  return (
    <div>
      <PageHeader
        title="Competitive Moves"
        subtitle="Product strategy, pricing actions, distribution shifts, and strategic partnerships"
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {types.slice(1).map(t => (
          <StatBox key={t} value={data.filter(d => d.move_type === t).length} label={t} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {types.map(t => (
          <Tag key={t} style={{ cursor: 'pointer', fontSize: 12 }} color={typeFilter === t ? (MOVE_TYPE_COLOR[t] || token.colorPrimary) : undefined}
               onClick={() => setTypeFilter(t)}>
            {t} ({t === 'All' ? data.length : data.filter(d => d.move_type === t).length})
          </Tag>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {filtered.map(move => (
          <Card key={move.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{move.companies?.name}</span>
              <Tag color={MOVE_TYPE_COLOR[move.move_type] || '#6B7280'} style={{ fontSize: 10 }}>{move.move_type}</Tag>
            </div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6, marginBottom: 8 }}>{move.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag color={move.impact === 'High' ? 'red' : move.impact === 'Medium' ? 'orange' : 'default'} style={{ fontSize: 10 }}>{move.impact} Impact</Tag>
              {move.source && <SourceBadge tier={move.tier || 'Verified'} text={move.source} />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Leadership & Governance ─────────────────────────────
export function LeadershipPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { intelApi.leadership().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data?.length) return <Empty description="No leadership alerts" />;

  const riskGroups = { Red: [], Amber: [], Green: [] };
  for (const item of data) {
    const rs = item.risk_score;
    if (rs >= 7) riskGroups.Red.push(item);
    else if (rs >= 4) riskGroups.Amber.push(item);
    else riskGroups.Green.push(item);
  }

  return (
    <div>
      <PageHeader
        title="Leadership & Governance"
        subtitle="CEO/CXO changes, board reshuffles, promoter movements, and governance flags"
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatBox value={data.length} label="Total Events" />
        <StatBox value={riskGroups.Red.length} label="Red Risk" color="#DC2626" />
        <StatBox value={riskGroups.Amber.length} label="Amber Risk" color="#F59E0B" />
        <StatBox value={riskGroups.Green.length} label="Green/Stable" color="#059669" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {data.map(item => {
          const riskColor = item.risk_score >= 7 ? '#DC2626' : item.risk_score >= 4 ? '#F59E0B' : '#059669';
          return (
            <Card key={item.id} accent={riskColor}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{item.companies?.name}</span>
                  <Tag style={{ marginLeft: 8, fontSize: 10 }} color={riskColor}>{item.alert_type}</Tag>
                </div>
                <SeverityDots score={item.risk_score != null ? Math.min(Math.ceil(item.risk_score / 2), 5) : 0} />
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, color: token.colorText, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{item.description}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-Sector Deep Dive ────────────────────────────────
export function DeepDivePage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { intelApi.subSectorDeepDive().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data) return <Empty description="No data available" />;

  return (
    <div>
      <PageHeader
        title="Sub-Sector Deep Dive"
        subtitle="Cost structure benchmarking, margin levers, and scale vs profitability analysis"
      />

      {/* Sub-sector breakdown */}
      {Object.entries(data.by_sub_sector || {}).map(([sector, companies]) => (
        <div key={sector} style={{ marginBottom: 24 }}>
          <SubHeader>{sector} ({companies.length})</SubHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {companies.map(c => (
              <Card key={c.id}>
                <div style={{ fontWeight: 700, fontSize: 14, color: token.colorText, marginBottom: 4 }}>{c.name}</div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  <Tag color={PERF_COLOR[c.perf]} style={{ fontSize: 10 }}>{c.perf}</Tag>
                  {c.am_signal && <Tag style={{ fontSize: 10 }}>{c.am_signal}</Tag>}
                </div>
                {c.product_mix?.length > 0 && (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: token.colorTextTertiary, textTransform: 'uppercase', marginBottom: 4 }}>Product Mix</div>
                    {c.product_mix.map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: token.colorTextSecondary, marginBottom: 2 }}>
                        <span>{p.segment}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
                {c.premium_mix?.[0] && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <Tag color="gold" style={{ fontSize: 10 }}>Premium {c.premium_mix[0].premium}%</Tag>
                    <Tag style={{ fontSize: 10 }}>Mass {c.premium_mix[0].mass}%</Tag>
                    <Tag style={{ fontSize: 10 }}>Economy {c.premium_mix[0].economy}%</Tag>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Scale Matrix */}
      {data.scale_matrix?.length > 0 && (
        <>
          <SubHeader>Scale vs. Profitability Matrix</SubHeader>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Table
              dataSource={data.scale_matrix}
              rowKey="id"
              size="small"
              pagination={false}
              columns={[
                { title: 'Company', key: 'company', width: 160, render: (_, r) => <span style={{ fontWeight: 600 }}>{r.companies?.name}</span> },
                { title: 'Sub-Sector', key: 'sub', width: 110, render: (_, r) => <Tag style={{ fontSize: 10 }}>{r.companies?.sub_sector}</Tag> },
                { title: 'Revenue (Cr)', dataIndex: 'revenue_cr', key: 'rev', width: 120, render: v => v ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toLocaleString('en-IN')}</span> : '-' },
                { title: 'EBITDA %', dataIndex: 'ebitda_pct', key: 'ebitda', width: 90, render: v => v != null ? <span style={{ fontFamily: 'monospace' }}>{Number(v).toFixed(1)}%</span> : '-' },
                { title: 'Business Model', dataIndex: 'description', key: 'desc', ellipsis: true },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}

// ─── Advisory Pipeline ───────────────────────────────────
export function AdvisoryPipelinePage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { intelApi.advisoryPipeline().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data) return <Empty description="No data available" />;

  return (
    <div>
      <PageHeader
        title="Advisory Pipeline"
        subtitle="Signal-driven advisory opportunity pipeline derived from cross-section intelligence"
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatBox value={data.stats?.total || 0} label="Accounts" />
        <StatBox value={data.stats?.total_sub_opportunities || 0} label="Sub-Opportunities" />
        {Object.entries(data.stats?.by_stage || {}).map(([stage, count]) => (
          <StatBox key={stage} value={count} label={stage} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {(data.opportunities || []).map(opp => (
          <Card key={opp.id} accent={STAGE_COLOR[opp.stage] === 'green' ? '#059669' : STAGE_COLOR[opp.stage] === 'blue' ? '#3B82F6' : STAGE_COLOR[opp.stage] === 'orange' ? '#F59E0B' : '#7C3AED'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{opp.account}</span>
              <Tag color={STAGE_COLOR[opp.stage]} style={{ fontSize: 10 }}>{opp.stage}</Tag>
            </div>
            {opp.companies?.name && <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 8 }}>{opp.companies.name}</div>}
            {opp.companies?.signal_taxonomy?.[0] && (
              <div style={{ marginBottom: 8 }}>
                <SignalTypeBadge type={opp.companies.signal_taxonomy[0].primary_type} />
              </div>
            )}
            {(opp.sub_opportunities || []).length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: token.colorTextTertiary, textTransform: 'uppercase', marginBottom: 6 }}>Sub-Opportunities</div>
                {opp.sub_opportunities.map(s => (
                  <div key={s.id} style={{ padding: '6px 10px', background: token.colorBgElevated, borderRadius: 5, marginBottom: 4, border: `1px solid ${token.colorBorder}` }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: token.colorText }}>{s.name}</div>
                    {s.service_line && <Tag style={{ fontSize: 9, marginTop: 2 }}>{s.service_line}</Tag>}
                  </div>
                ))}
              </div>
            )}
            {opp.signal_cross_refs?.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 10, color: token.colorTextTertiary }}>
                {opp.signal_cross_refs.length} cross-referenced signals
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Action Lens ─────────────────────────────────────────
export function ActionLensPage() {
  const { token } = theme.useToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePersona, setActivePersona] = useState(null);
  useEffect(() => { intelApi.actionLens().then(r => { setData(r.data); if (r.data?.length) setActivePersona(r.data[0].persona); }).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (!data?.length) return <Empty description="No data available" />;

  const personas = [...new Set(data.map(d => d.persona))];
  const filtered = data.filter(d => d.persona === activePersona);

  return (
    <div>
      <PageHeader
        title="Action Lens"
        subtitle="Stakeholder-specific intelligence insights organized by persona"
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {personas.map(p => {
          const count = data.filter(d => d.persona === p).length;
          return (
            <Tag key={p} style={{ cursor: 'pointer', fontSize: 12, padding: '4px 12px' }}
                 color={p === activePersona ? token.colorPrimary : undefined}
                 onClick={() => setActivePersona(p)}>
              {p} ({count})
            </Tag>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {filtered.map(item => (
          <Card key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{item.title}</div>
            </div>
            {item.companies && <CompanyPill name={item.companies.name} />}
            <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6, marginTop: 8 }}>{item.description}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Watchlist & Forward Indicators ──────────────────────
export function WatchlistPage() {
  const { token } = theme.useToken();
  const [watchlist, setWatchlist] = useState(null);
  const [drifts, setDrifts] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      intelApi.watchlist().then(r => setWatchlist(r.data)).catch(() => {}),
      intelApi.drifts().then(r => setDrifts(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;

  // Group watchlist by severity
  const high = (watchlist || []).filter(w => w.severity_score >= 7);
  const medium = (watchlist || []).filter(w => w.severity_score >= 4 && w.severity_score < 7);
  const low = (watchlist || []).filter(w => w.severity_score < 4);

  return (
    <div>
      <PageHeader
        title="Watchlist & Forward Indicators"
        subtitle="Companies requiring attention and forward-looking signals"
      />

      {watchlist?.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatBox value={watchlist.length} label="Total Signals" />
          <StatBox value={high.length} label="Critical" color="#DC2626" />
          <StatBox value={medium.length} label="Monitor" color="#F59E0B" />
          <StatBox value={low.length} label="Watch" color="#059669" />
        </div>
      )}

      {/* Watchlist cards by severity */}
      {high.length > 0 && (
        <>
          <SubHeader>Stress Indicators</SubHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12, marginBottom: 24 }}>
            {high.map(item => (
              <Card key={item.id} accent="#DC2626">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{item.companies?.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SeverityDots score={Math.min(Math.ceil(item.severity_score / 2), 5)} />
                    <Badge count={item.severity_score} color="#DC2626" />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: token.colorText, marginBottom: 6 }}>{item.signal_text}</div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{item.detail}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {item.companies?.sub_sector && <Tag style={{ fontSize: 10 }}>{item.companies.sub_sector}</Tag>}
                  {item.companies?.am_signal && <Tag style={{ fontSize: 10 }}>{item.companies.am_signal}</Tag>}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {medium.length > 0 && (
        <>
          <SubHeader>Monitor</SubHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12, marginBottom: 24 }}>
            {medium.map(item => (
              <Card key={item.id} accent="#F59E0B">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: token.colorText }}>{item.companies?.name}</span>
                  <Badge count={item.severity_score} color="#F59E0B" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: token.colorText, marginBottom: 6 }}>{item.signal_text}</div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary, lineHeight: 1.6 }}>{item.detail}</div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Narrative Drifts as forward indicators */}
      {drifts?.length > 0 && (
        <>
          <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: 8, paddingTop: 8 }} />
          <SubHeader description="Where management narrative has shifted between quarters">Narrative Drifts — Forward Signals</SubHeader>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Table
              dataSource={drifts}
              rowKey="id"
              size="small"
              pagination={false}
              columns={[
                { title: 'Company', key: 'company', width: 150, render: (_, r) => <span style={{ fontWeight: 600 }}>{r.companies?.name}</span> },
                { title: 'Topic', dataIndex: 'topic', key: 'topic', width: 140 },
                { title: 'Before', dataIndex: 'narrative_before', key: 'before', ellipsis: true },
                { title: 'After', dataIndex: 'narrative_after', key: 'after', ellipsis: true },
                { title: 'Shift', dataIndex: 'shift_type', key: 'shift', width: 100, render: v => <Tag>{v}</Tag> },
                { title: 'Severity', dataIndex: 'severity', key: 'sev', width: 80, render: v => <Tag color={v === 'critical' ? 'red' : v === 'high' ? 'orange' : 'default'}>{v}</Tag> },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}
