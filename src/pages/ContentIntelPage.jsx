import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import ContentIntel from '../components/feature-report/ContentIntel';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, FileText } from 'lucide-react';

/* ─── Sample data for visualization ─── */
const SAMPLE_DATA = {
  scorecard: {
    total_content_30d: 47,
    your_rate_vs_avg: '8 vs 12/mo',
    gaps_found: 6,
    top_trending_theme: 'AI-Powered Automation',
    most_active_competitor: 'Flowcast',
  },
  activity_feed: [
    {
      company: 'Flowcast',
      title: 'How AI Is Transforming Accounts Receivable in 2026',
      content_type: 'Blog',
      date: 'Mar 15, 2026',
      topics: ['AI', 'AR Automation'],
      notable: true,
      summary: 'Flowcast argues that AI-powered AR is moving from experimental to essential, citing 60% faster processing times. They position themselves as the pioneer in autonomous cash application.',
      key_takeaway: 'Positioning shift — Flowcast is doubling down on "autonomous finance" narrative, directly challenging HighRadius\' automation claims.',
      url: '#',
    },
    {
      company: 'Planful',
      title: 'The Complete Guide to FP&A Consolidation',
      content_type: 'Whitepaper',
      date: 'Mar 14, 2026',
      topics: ['FP&A', 'Consolidation'],
      notable: false,
      summary: 'A 32-page whitepaper covering multi-entity consolidation workflows, targeting mid-market CFOs migrating from spreadsheets.',
      key_takeaway: 'Planful is investing heavily in gated content — this is their 3rd whitepaper in 6 weeks, likely building an email nurture pipeline.',
      url: '#',
    },
    {
      company: 'BlackLine',
      title: 'Customer Story: How Unilever Cut Close Time by 40%',
      content_type: 'Case Study',
      date: 'Mar 12, 2026',
      topics: ['Financial Close', 'Enterprise'],
      notable: true,
      summary: 'Enterprise case study with Unilever as the named customer, focusing on close cycle reduction and audit readiness.',
      key_takeaway: 'BlackLine is leading with enterprise social proof — naming Fortune 500 logos. Consider whether your customer stories can match this caliber.',
      url: '#',
    },
    {
      company: 'Flowcast',
      title: 'Webinar: NetSuite Advanced Integration Deep Dive',
      content_type: 'Video',
      date: 'Mar 10, 2026',
      topics: ['Integration', 'NetSuite'],
      notable: false,
      summary: 'Technical webinar targeting NetSuite users, demonstrating native integration capabilities that bypass middleware.',
      key_takeaway: 'Integration content = targeting BlackLine\'s migration audience. The "close in 5 days" messaging continues.',
      url: '#',
    },
    {
      company: 'Planful',
      title: 'Release Notes: March 2026 — AI Forecasting v2',
      content_type: 'Release Note',
      date: 'Mar 8, 2026',
      topics: ['Product Update', 'AI'],
      notable: false,
      summary: 'Major product update featuring improved ML-based forecasting with variance explanations.',
      key_takeaway: 'Planful shipping AI features at increased velocity — 3rd AI feature in 2 quarters.',
      url: '#',
    },
    {
      company: 'BlackLine',
      title: 'Press Release: Named a Leader in Gartner Magic Quadrant 2026',
      content_type: 'Press Release',
      date: 'Mar 5, 2026',
      topics: ['Analyst Recognition'],
      notable: true,
      summary: 'BlackLine announces Gartner MQ leader position for the 5th consecutive year in financial close and consolidation.',
      key_takeaway: 'BlackLine will use this aggressively in sales cycles. Prepare counter-positioning for deals where this comes up.',
      url: '#',
    },
    {
      company: 'Flowcast',
      title: '5 Signs Your AR Process Needs AI — Checklist',
      content_type: 'Blog',
      date: 'Mar 3, 2026',
      topics: ['AI', 'AR Automation'],
      notable: false,
      summary: 'Top-of-funnel listicle targeting SMB finance leaders who haven\'t adopted AI yet.',
      key_takeaway: 'Classic TOFU play — Flowcast is going wider to capture earlier-stage buyers.',
      url: '#',
    },
  ],
  theme_clusters: [
    {
      theme: 'AI-Powered Automation',
      total_pieces: 14,
      trend: 'accelerating',
      competitors: [
        { name: 'Flowcast', count: 8 },
        { name: 'Planful', count: 4 },
        { name: 'BlackLine', count: 2 },
      ],
      your_coverage: 3,
      insight: 'Flowcast is producing 2x more AI content than anyone else — establishing thought leadership in autonomous finance. Your 3 pieces are reactive, not proactive.',
    },
    {
      theme: 'Financial Close Optimization',
      total_pieces: 9,
      trend: 'steady',
      competitors: [
        { name: 'BlackLine', count: 6 },
        { name: 'Planful', count: 3 },
      ],
      your_coverage: 5,
      insight: 'BlackLine owns this narrative with enterprise case studies. Your coverage is solid but lacks named enterprise logos.',
    },
    {
      theme: 'NetSuite / ERP Integration',
      total_pieces: 7,
      trend: 'accelerating',
      competitors: [
        { name: 'Flowcast', count: 5 },
        { name: 'BlackLine', count: 2 },
      ],
      your_coverage: 0,
      insight: 'Flowcast is aggressively targeting NetSuite users — a market you have zero content presence in. Critical gap.',
    },
    {
      theme: 'Compliance & Audit Readiness',
      total_pieces: 6,
      trend: 'steady',
      competitors: [
        { name: 'BlackLine', count: 4 },
        { name: 'Planful', count: 2 },
      ],
      your_coverage: 1,
      insight: 'Compliance is evergreen demand. BlackLine\'s 4 pieces drive consistent organic traffic. Your single piece is outdated.',
    },
    {
      theme: 'Mid-Market FP&A',
      total_pieces: 5,
      trend: 'accelerating',
      competitors: [
        { name: 'Planful', count: 5 },
      ],
      your_coverage: 0,
      insight: 'Planful owns mid-market FP&A content entirely. If you compete in this segment, this is a blind spot.',
    },
    {
      theme: 'Cash Flow Forecasting',
      total_pieces: 4,
      trend: 'steady',
      competitors: [
        { name: 'Flowcast', count: 3 },
        { name: 'Planful', count: 1 },
      ],
      your_coverage: 2,
      insight: 'Competitive coverage — you\'re in the conversation but Flowcast publishes more frequently.',
    },
  ],
  content_gaps: [
    {
      topic: 'NetSuite Integration Guides',
      severity: 'critical',
      competitors: [
        { name: 'Flowcast', count: 5 },
        { name: 'BlackLine', count: 2 },
      ],
      sample_titles: [
        'NetSuite Advanced: How to Eliminate Manual Journal Entries',
        'The Complete Guide to NetSuite AR Automation',
        'Why Middleware is Killing Your NetSuite ROI',
      ],
      recommendation: 'Create a comprehensive NetSuite integration guide targeting mid-market finance teams migrating from manual processes. Differentiate by covering multi-subsidiary scenarios that Flowcast doesn\'t address.',
    },
    {
      topic: 'Mid-Market FP&A Use Cases',
      severity: 'critical',
      competitors: [
        { name: 'Planful', count: 5 },
      ],
      sample_titles: [
        'FP&A for Growing Companies: When Spreadsheets Break',
        'How to Build Your First Rolling Forecast',
        'The CFO\'s Guide to Consolidation Without an Enterprise Tool',
      ],
      recommendation: 'If mid-market FP&A is in your ICP, you need foundational content here. Start with a "vs spreadsheets" angle — Planful already owns the "vs enterprise tools" narrative.',
    },
    {
      topic: 'AI in Financial Operations',
      severity: 'high',
      competitors: [
        { name: 'Flowcast', count: 8 },
        { name: 'Planful', count: 4 },
      ],
      sample_titles: [
        'How AI Is Transforming Accounts Receivable in 2026',
        'AI Forecasting: From Buzzword to Board-Ready',
      ],
      recommendation: 'You have 3 pieces but competitors have 12. Publish a definitive guide that goes deeper — position as "honest AI" vs competitors\' marketing hype. Leverage your claims audit data.',
    },
    {
      topic: 'SOX Compliance Automation',
      severity: 'medium',
      competitors: [
        { name: 'BlackLine', count: 3 },
      ],
      sample_titles: [
        'SOX Compliance in 2026: What\'s Changed',
        'Automating SOX Controls Without the Audit Anxiety',
      ],
      recommendation: 'Create a compliance-focused piece that positions your audit trail capabilities. BlackLine owns this but their content is enterprise-heavy — there\'s a mid-market angle available.',
    },
  ],
  publishing_cadence: [
    {
      name: 'Flowcast',
      posts_30d: 16,
      posts_90d: 38,
      avg_per_month: 13,
      trend: 'accelerating',
      content_mix: { Blog: 45, 'Case Study': 15, Video: 20, Whitepaper: 10, 'Release Note': 10 },
      format_gaps: [],
    },
    {
      name: 'BlackLine',
      posts_30d: 12,
      posts_90d: 35,
      avg_per_month: 11,
      trend: 'steady',
      content_mix: { Blog: 35, 'Case Study': 25, 'Press Release': 15, Whitepaper: 15, Video: 10 },
      format_gaps: [],
    },
    {
      name: 'Planful',
      posts_30d: 11,
      posts_90d: 28,
      avg_per_month: 9,
      trend: 'accelerating',
      content_mix: { Blog: 40, Whitepaper: 30, 'Release Note': 15, Video: 15 },
      format_gaps: ['Case Study'],
    },
    {
      name: 'You',
      posts_30d: 8,
      posts_90d: 22,
      avg_per_month: 7,
      trend: 'steady',
      content_mix: { Blog: 60, 'Case Study': 20, 'Release Note': 20 },
      format_gaps: ['Video', 'Whitepaper', 'Podcast'],
    },
  ],
  keyword_landscape: {
    missing_keywords: [
      { keyword: 'netsuite accounts receivable automation', search_volume: 2400, competitors_ranking: [{ name: 'Flowcast', position: 3 }, { name: 'BlackLine', position: 7 }] },
      { keyword: 'FP&A software mid market', search_volume: 1800, competitors_ranking: [{ name: 'Planful', position: 2 }] },
      { keyword: 'AI cash application', search_volume: 1200, competitors_ranking: [{ name: 'Flowcast', position: 1 }] },
      { keyword: 'financial close automation SOX', search_volume: 900, competitors_ranking: [{ name: 'BlackLine', position: 4 }] },
      { keyword: 'accounts receivable AI software', search_volume: 3100, competitors_ranking: [{ name: 'Flowcast', position: 2 }, { name: 'BlackLine', position: 5 }] },
    ],
    movers: [
      { keyword: 'autonomous finance platform', competitor: 'Flowcast', direction: 'up', change: 12, new_position: 4 },
      { keyword: 'financial close software', competitor: 'BlackLine', direction: 'up', change: 3, new_position: 1 },
      { keyword: 'FP&A consolidation tool', competitor: 'Planful', direction: 'up', change: 8, new_position: 3 },
      { keyword: 'AR automation pricing', competitor: 'Flowcast', direction: 'down', change: 5, new_position: 11 },
    ],
  },
  strategic_insights: [
    {
      priority: 'high',
      type: 'Content Strategy Shift',
      observation: 'Flowcast published 8 AI-focused content pieces in 30 days — 3x their historical average. Their messaging has shifted from "automation" to "autonomous finance," signaling a deliberate repositioning.',
      implication: 'Flowcast is establishing AI thought leadership in AR. If unchecked, they will own the "AI in finance" search narrative within 2 quarters. Your 3 AI pieces are being outpaced.',
      action: 'Publish a definitive "State of AI in Financial Operations" guide within 2 weeks. Use your claims audit data to challenge Flowcast\'s "autonomous" claims with evidence-backed analysis — a differentiated angle they can\'t match.',
    },
    {
      priority: 'high',
      type: 'Content Gap',
      observation: 'Zero content presence in NetSuite integration — a keyword cluster with 7,500+ monthly search volume where Flowcast has 5 ranking pieces and BlackLine has 2.',
      implication: 'You are invisible to the entire NetSuite buyer segment. Any prospect searching for NetSuite + AR/finance automation will find competitors only.',
      action: 'Create a "NetSuite Integration Hub" — 3 pieces targeting different intent levels: a comparison page (BOFU), a how-to guide (MOFU), and a "signs you need automation" post (TOFU). Prioritize the comparison page for fastest ranking.',
    },
    {
      priority: 'medium',
      type: 'Format Gap',
      observation: 'You produce zero video content. Flowcast publishes 20% video (webinars, demos). BlackLine uses video for customer stories. Industry average is 15% video mix.',
      implication: 'Video content has 2x engagement vs blog in B2B finance (BuzzSumo data). Missing this format means lower social shares and reduced LLM training data inclusion.',
      action: 'Start with monthly webinars on topics where you have expertise. Record customer testimonials. Repurpose into short LinkedIn clips — this serves both content and social strategy.',
    },
    {
      priority: 'medium',
      type: 'Competitive Opportunity',
      observation: 'Planful has no case studies in their content mix (100% educational content). BlackLine leads with 25% case studies featuring Fortune 500 logos.',
      implication: 'There is a gap between Planful\'s "educational" approach and BlackLine\'s "proof-heavy" approach. You can position in the middle — proof-backed education.',
      action: 'Create 2 customer stories with measurable outcomes (% close time reduction, $ savings) and embed them within educational content. This hybrid format is underused by all competitors.',
    },
  ],
};

const SAMPLE_META = {
  main_company: { name: 'HighRadius', logo_url: null },
  competitors: [
    { name: 'Flowcast', logo_url: null },
    { name: 'BlackLine', logo_url: null },
    { name: 'Planful', logo_url: null },
  ],
};


export default function ContentIntelPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  // Use real data if available, otherwise sample data for visualization
  const hasRealData = data?.content_intel;
  const displayData = hasRealData ? data.content_intel : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  // Only show loading spinner if we have a project and are actually loading real data
  if (projectId && loading) {
    return <Spinner text="Loading content intelligence..." subtext="Checking for cached report data" />;
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
          <div className="report-error-title">Failed to load content intelligence</div>
          <div className="report-error-desc">{error}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn-primary" onClick={() => loadReport()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-root report-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={24} style={{ color: 'var(--azure)' }} />
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>Content & Blog Intelligence</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Track competitor content strategies, spot gaps, and find opportunities for your content calendar
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

      <ContentIntel data={displayData} meta={displayMeta} />
    </div>
  );
}
