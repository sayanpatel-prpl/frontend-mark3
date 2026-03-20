import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import MessagingPlaybook from '../components/feature-report/MessagingPlaybook';
import Spinner from '../components/report/ui/Spinner';
import CompanyLogo from '../components/feature-report/CompanyLogo';
import { RefreshCw, PenTool, TrendingUp, GitCompare, ArrowRight } from 'lucide-react';

/* ─── Sample data — exact website copy from HighRadius competitors ─── */
const SAMPLE_PLAYBOOK = [
  {
    company: 'HighRadius',
    tagline: 'AI-Native Order-to-Cash & Treasury Management Software',
    tagline_source: 'highradius.com homepage',
    value_prop: 'HighRadius offers AI-powered Autonomous Software for the Office of the CFO. More than 900 of the world\'s leading companies have transformed their order to cash, treasury and record to report processes with HighRadius.',
    value_prop_source: 'highradius.com/about',
    target_persona: 'CFO / VP Finance',
    target_segment: 'Enterprise ($500M+ revenue), manufacturing & CPG heavy',
    key_messages_detailed: [
      { text: 'AI-native, not AI-added — built from the ground up with machine learning', source: 'highradius.com/ai' },
      { text: 'Autonomous finance — reduce manual touchpoints to near zero', source: 'highradius.com/autonomous-software' },
      { text: '900+ enterprise customers including P&G, Johnson & Johnson, Kellogg\'s', source: 'highradius.com/customers' },
      { text: '$3.7M average annual savings per customer', source: 'highradius.com/roi' },
    ],
    pain_points_detailed: [
      { text: 'Manual cash application taking days instead of minutes', addressed_by: 'AI-native cash application' },
      { text: 'DSO too high — cash trapped in receivables', addressed_by: '35% DSO reduction' },
      { text: 'Finance teams spending 80% of time on manual tasks', addressed_by: 'Autonomous finance' },
      { text: 'Disconnected O2C processes across ERP systems', addressed_by: 'Unified O2C platform' },
    ],
    overpromises: ['Autonomous', '100% touchless'],
    counter_points: null,
  },
  {
    company: 'BlackLine',
    tagline: 'Financial Close Management Solutions & Accounting Automation Software',
    tagline_source: 'blackline.com homepage',
    value_prop: 'BlackLine delivers a unified cloud platform for financial close automation, intercompany accounting, and accounts receivable automation. Trusted by 4,300+ organizations.',
    value_prop_source: 'blackline.com/why-blackline',
    target_persona: 'Controller / VP Accounting',
    target_segment: 'Enterprise & upper mid-market, public companies (SOX-regulated)',
    key_messages_detailed: [
      { text: 'Unified platform — close, reconcile, and report from one place', source: 'blackline.com/solutions' },
      { text: 'Gartner Magic Quadrant Leader 5 years running', source: 'blackline.com/analyst-recognition' },
      { text: '4,300+ customers — largest financial close customer base', source: 'blackline.com/why-blackline' },
      { text: 'Reduce close time by 30-50%', source: 'blackline.com/resources/roi' },
    ],
    pain_points_detailed: [
      { text: 'Month-end close takes too long and too many spreadsheets', addressed_by: 'Unified close platform' },
      { text: 'SOX compliance is manual, error-prone, and audit-risky', addressed_by: 'Automated SOX controls' },
      { text: 'Intercompany transactions create reconciliation nightmares', addressed_by: 'Intercompany hub' },
      { text: 'CFOs lack real-time visibility into close progress', addressed_by: 'Close progress dashboard' },
    ],
    overpromises: ['Complete visibility', 'Eliminate spreadsheets'],
    counter_points: [
      'Emphasize AI-native vs their automation-added approach — BlackLine was built for accounting workflows, not AI-first',
      'Their Gartner MQ leadership is in "Financial Close" — not AR/O2C where you compete directly',
      'Highlight implementation speed and TCO: BlackLine deployments average 6-9 months vs your 8-12 weeks',
    ],
  },
  {
    company: 'Flowcast',
    tagline: 'Autonomous Cash Application & AR Automation — Close in 5 Days',
    tagline_source: 'flowcast.ai homepage',
    value_prop: 'Flowcast is the fastest-growing AR automation platform built for mid-market finance teams. Our AI processes cash application autonomously, reducing DSO by 35% on average.',
    value_prop_source: 'flowcast.ai/about',
    target_persona: 'VP Finance / AR Manager',
    target_segment: 'Mid-market ($50-500M), NetSuite ecosystem',
    key_messages_detailed: [
      { text: 'Close in 5 days — fastest implementation in the market', source: 'flowcast.ai/implementation' },
      { text: 'Built for mid-market, not downsized enterprise', source: 'flowcast.ai homepage' },
      { text: 'NetSuite-native — no middleware, no workarounds', source: 'flowcast.ai/integrations/netsuite' },
      { text: '35% average DSO reduction in first 90 days', source: 'flowcast.ai/results' },
    ],
    pain_points_detailed: [
      { text: 'Enterprise tools are overkill for mid-market companies', addressed_by: 'Built for mid-market' },
      { text: 'NetSuite users have no good AR automation option', addressed_by: 'NetSuite-native integration' },
      { text: 'Implementation takes 6-12 months with legacy vendors', addressed_by: 'Close in 5 days' },
      { text: 'Cash application is still manual despite paying for "automation"', addressed_by: 'Autonomous cash application' },
    ],
    overpromises: ['Autonomous', 'Close in 5 days', 'Zero middleware'],
    counter_points: [
      '"Close in 5 days" doesn\'t address multi-subsidiary complexity — push on this in enterprise deals',
      'No track record with Fortune 500 — highlight your 900+ enterprise logos vs their startup profile',
      'NetSuite-only limits their TAM — position your multi-ERP support as a growth advantage',
    ],
  },
  {
    company: 'Planful',
    tagline: 'Financial Planning & Analysis Platform for the Office of the CFO',
    tagline_source: 'planful.com homepage',
    value_prop: 'Planful delivers the only end-to-end FP&A and financial close platform purpose-built for mid-market companies. Accelerate budget cycles, improve forecast accuracy, and close faster.',
    value_prop_source: 'planful.com/why-planful',
    target_persona: 'FP&A Director / CFO',
    target_segment: 'Mid-market ($100M-1B), companies outgrowing Excel for planning',
    key_messages_detailed: [
      { text: 'Purpose-built for mid-market — not stripped-down enterprise', source: 'planful.com homepage' },
      { text: 'End-to-end: planning, budgeting, consolidation, and close', source: 'planful.com/platform' },
      { text: 'Replace spreadsheet-based FP&A with structured workflows', source: 'planful.com/solutions/fpa' },
      { text: '70% faster budget cycles with Planful Predict', source: 'planful.com/predict' },
    ],
    pain_points_detailed: [
      { text: 'FP&A teams drowning in spreadsheets and version control', addressed_by: 'Structured FP&A workflows' },
      { text: 'Budgeting cycles take months, not weeks', addressed_by: '70% faster budget cycles' },
      { text: 'Forecasts based on gut feel, not data', addressed_by: 'Planful Predict AI forecasting' },
      { text: 'Can\'t afford Workday/Anaplan but need more than Excel', addressed_by: 'Purpose-built mid-market pricing' },
    ],
    overpromises: ['End-to-end', 'Replace spreadsheets'],
    counter_points: [
      'Planful competes in FP&A, not AR — position as complementary if encountered in a deal',
      'If they push "Office of the CFO" positioning, counter that your O2C coverage is deeper',
      'Their close capabilities are lightweight vs BlackLine/your offering — expose this in evaluations',
    ],
  },
  {
    company: 'Workday',
    tagline: 'The Finance, HR, and Planning System for a Changing World',
    tagline_source: 'workday.com homepage',
    value_prop: 'Workday provides enterprise cloud applications for financial management, human capital management, and adaptive planning. Trusted by 60% of Fortune 500 companies.',
    value_prop_source: 'workday.com/en-us/why-workday',
    target_persona: 'CIO / CFO',
    target_segment: 'Large enterprise ($1B+), platform consolidation buyers',
    key_messages_detailed: [
      { text: 'One system for finance, HR, and planning — no integrations needed', source: 'workday.com/products' },
      { text: '60% of Fortune 500 run on Workday', source: 'workday.com/why-workday' },
      { text: 'Adaptive Planning — AI-driven forecasting that learns over time', source: 'workday.com/products/adaptive-planning' },
      { text: 'Built for the enterprise from day one, not cobbled from acquisitions', source: 'workday.com/why-workday' },
    ],
    pain_points_detailed: [
      { text: 'Multiple disconnected systems for finance, HR, and planning', addressed_by: 'One unified system' },
      { text: 'Legacy ERP is rigid and expensive to customize', addressed_by: 'Cloud-native, configurable' },
      { text: 'Need real-time financial data, not month-old batch reports', addressed_by: 'Real-time reporting' },
      { text: 'Board wants a single "system of record" for all financial data', addressed_by: 'Unified data model' },
    ],
    overpromises: ['One system', 'Real-time'],
    counter_points: [
      'Position as "best-of-breed AR on top of any ERP" — many Workday customers add HighRadius for O2C depth',
      'Workday\'s AR capabilities are thin — they don\'t have autonomous cash application or deep O2C workflows',
      'Don\'t compete on ERP — compete on specialization. Their breadth is your weakness; your depth is theirs',
    ],
  },
];

const SAMPLE_META = {
  main_company: { name: 'HighRadius', logo_url: null },
  competitors: [
    { name: 'BlackLine', logo_url: null },
    { name: 'Flowcast', logo_url: null },
    { name: 'Planful', logo_url: null },
    { name: 'Workday', logo_url: null },
  ],
};

const SAMPLE_DRIFT = [
  {
    company: 'Flowcast',
    changes: [
      { date: 'Mar 2026', field: 'Tagline', from: 'Modern Cash Application for Mid-Market Finance', to: 'Autonomous Cash Application & AR Automation — Close in 5 Days', signal: 'Shifted from "modern" to "autonomous" — escalating AI claims. Added "Close in 5 Days" speed promise.', significance: 'high' },
      { date: 'Feb 2026', field: 'Positioning', from: 'Best AR tool for NetSuite users', to: 'Fastest-growing AR automation platform built for mid-market', signal: 'Broadening beyond NetSuite-only positioning. Claiming "fastest-growing" market momentum.', significance: 'high' },
      { date: 'Jan 2026', field: 'Key Message', from: 'Reduce manual touchpoints by 80%', to: '35% average DSO reduction in first 90 days', signal: 'Moving from activity metrics (touchpoints) to outcome metrics (DSO reduction). More compelling for CFOs.', significance: 'medium' },
    ],
  },
  {
    company: 'BlackLine',
    changes: [
      { date: 'Mar 2026', field: 'Key Message', from: '3,800+ customers worldwide', to: '4,300+ customers — largest financial close customer base', signal: 'Added "largest" claim and specific category ownership. Customer count grew 13% — highlighting momentum.', significance: 'medium' },
      { date: 'Feb 2026', field: 'Target Persona', from: 'CFO / Controller', to: 'Controller / VP Accounting', signal: 'Narrowing target from C-suite to accounting leadership. May indicate difficulty selling to CFOs directly.', significance: 'medium' },
      { date: 'Dec 2025', field: 'Value Prop', from: 'Cloud accounting automation', to: 'Unified cloud platform for financial close automation, intercompany accounting, and AR automation', signal: 'Expanded scope: added AR automation to their messaging. Direct competitive overlap with HighRadius increasing.', significance: 'high' },
    ],
  },
  {
    company: 'Planful',
    changes: [
      { date: 'Feb 2026', field: 'Key Message', from: 'Accelerate budget cycles by 50%', to: '70% faster budget cycles with Planful Predict', signal: 'Inflated the speed claim from 50% to 70%. Named the AI feature ("Predict") for brand recognition.', significance: 'medium' },
      { date: 'Jan 2026', field: 'Tagline', from: 'Connected Planning for the Modern CFO', to: 'Financial Planning & Analysis Platform for the Office of the CFO', signal: 'Dropped "connected planning" buzzword. Added "Office of the CFO" — mimicking HighRadius positioning.', significance: 'high' },
    ],
  },
  {
    company: 'Workday',
    changes: [
      { date: 'Mar 2026', field: 'Key Message', from: 'Trusted by 50% of Fortune 500', to: '60% of Fortune 500 run on Workday', signal: 'Updated market penetration claim from 50% to 60%. Strong momentum proof point.', significance: 'medium' },
      { date: 'Jan 2026', field: 'Product', from: 'Adaptive Planning', to: 'Adaptive Planning — AI-driven forecasting that learns over time', signal: 'Added AI narrative to planning product. Following Planful\'s AI push.', significance: 'medium' },
    ],
  },
];

/* ─── Messaging Drift Component ─── */
function MessagingDrift({ driftData, logoMap }) {
  if (!driftData || driftData.length === 0) return null;

  const sigColors = {
    high: { bg: '#FEE2E2', color: '#991B1B', border: '#DC2626', badge: '#DC2626' },
    medium: { bg: '#FEF3C7', color: '#92400E', border: '#D97706', badge: '#D97706' },
    low: { bg: '#DBEAFE', color: '#1E40AF', border: '#2563EB', badge: '#2563EB' },
  };

  // Flatten all changes into a timeline sorted by date (most recent first)
  const allChanges = driftData.flatMap(d => d.changes.map(c => ({ ...c, company: d.company })));
  allChanges.sort((a, b) => {
    const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    const parseDate = (s) => { const [m, y] = s.split(' '); return parseInt(y) * 100 + (months[m] || 0); };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary stats */}
      <div style={{
        display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden',
        border: '1px solid var(--gray-200)', background: 'var(--gray-50)', marginBottom: 10,
      }}>
        {[
          { label: 'Total Changes Detected', value: allChanges.length },
          { label: 'High Significance', value: allChanges.filter(c => c.significance === 'high').length },
          { label: 'Companies With Shifts', value: driftData.length },
          { label: 'Most Active', value: driftData.sort((a, b) => b.changes.length - a.changes.length)[0]?.company },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: '14px 16px',
            borderRight: i < 3 ? '1px solid var(--gray-200)' : 'none',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray-400)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: typeof s.value === 'number' ? '1.3rem' : '0.88rem', fontWeight: 700, color: 'var(--navy)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="card" style={{ padding: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 2 }}>Messaging Change Timeline</h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem', marginBottom: 16 }}>Detected shifts in competitor positioning, taglines, and key messages</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 80 }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 130 }}>Company</th>
                <th style={{ textAlign: 'left', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>Changed</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>From → To</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--gray-500)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', width: 80 }}>Impact</th>
              </tr>
            </thead>
            <tbody>
              {allChanges.map((change, i) => {
                const sc = sigColors[change.significance] || sigColors.medium;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: change.significance === 'high' ? '#FFF8F8' : 'transparent' }}>
                    <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 500, verticalAlign: 'top' }}>{change.date}</td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CompanyLogo name={change.company} logoUrl={logoMap[change.company]} size={18} />
                        <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{change.company}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: '0.68rem', fontWeight: 600, background: 'var(--gray-100)', color: 'var(--gray-600)' }}>{change.field}</span>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', color: '#991B1B', textDecoration: 'line-through', lineHeight: 1.4, marginBottom: 4 }}>{change.from}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4 }}>{change.to}</div>
                          </div>
                        </div>
                        {change.signal && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', lineHeight: 1.4, fontStyle: 'italic' }}>
                            {change.signal}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', verticalAlign: 'top' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700, background: sc.badge, color: '#fff', textTransform: 'uppercase' }}>{change.significance}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default function MessagingPlaybookPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  // Normalize LLM data
  let playbook = data?.messaging_playbook;
  if (playbook && !Array.isArray(playbook) && typeof playbook === 'object') {
    const found = Object.values(playbook).find(v => Array.isArray(v));
    playbook = found || [];
  }

  const hasRealData = playbook?.length > 0;
  const displayData = hasRealData ? playbook : SAMPLE_PLAYBOOK;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  if (projectId && loading) {
    return <Spinner text="Loading messaging playbook..." subtext="Checking for cached report data" />;
  }

  if (projectId && !data && status && status !== 'failed') {
    return (
      <Spinner
        text={statusLabel || 'Generating report...'}
        subtext="This may take 20-40 minutes for the first generation. Subsequent loads will be instant."
      />
    );
  }

  if (projectId && error) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">Failed to load messaging playbook</div>
          <div className="report-error-desc">{error}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn-primary" onClick={() => loadReport()}>Retry</button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('playbook');

  const logoMap = {};
  const allCompanies = [displayMeta?.main_company, ...(displayMeta?.competitors || [])].filter(Boolean);
  for (const c of allCompanies) { logoMap[c.name] = c.logo_url; }

  const tabs = [
    { key: 'playbook', label: 'Current Playbook', icon: <PenTool size={15} /> },
    { key: 'drift', label: 'Messaging Drift', icon: <GitCompare size={15} /> },
  ];

  return (
    <div className="report-root report-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PenTool size={24} style={{ color: 'var(--azure)' }} />
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>Competitor Messaging Playbook</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            How competitors position themselves and how their messaging evolves over time
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showSample && (
            <span style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
              background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase',
            }}>Sample Data</span>
          )}
          {projectId && (
            <button
              className="btn-secondary"
              onClick={refresh}
              disabled={refreshing}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
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

      {activeTab === 'playbook' && (
        <MessagingPlaybook data={displayData} meta={displayMeta} />
      )}

      {activeTab === 'drift' && (
        <MessagingDrift driftData={SAMPLE_DRIFT} logoMap={logoMap} />
      )}
    </div>
  );
}
