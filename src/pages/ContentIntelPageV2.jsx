import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import ContentIntelV2 from '../components/feature-report/ContentIntelV2';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, FileText } from 'lucide-react';

/* ─── Sample data for visualization ─── */
const SAMPLE_DATA = {
  scorecard: {
    total_content_30d: 78,
    your_rate_vs_avg: '8 vs 13/mo',
    gaps_found: 8,
    top_trending_theme: 'AI-Powered Automation',
    most_active_competitor: 'Flowcast',
  },
  content_inventory: [
    { name: 'BlackLine', is_you: false, domain: 'blackline.com', domain_authority: 71, est_monthly_traffic: 310000, total_pages: 580 },
    { name: 'Workday', is_you: false, domain: 'workday.com', domain_authority: 89, est_monthly_traffic: 2400000, total_pages: 1850 },
    { name: 'HighRadius', is_you: true, domain: 'highradius.com', domain_authority: 62, est_monthly_traffic: 185000, total_pages: 412 },
    { name: 'Planful', is_you: false, domain: 'planful.com', domain_authority: 58, est_monthly_traffic: 145000, total_pages: 340 },
    { name: 'OneStream', is_you: false, domain: 'onestream.com', domain_authority: 55, est_monthly_traffic: 120000, total_pages: 290 },
    { name: 'Flowcast', is_you: false, domain: 'flowcast.ai', domain_authority: 45, est_monthly_traffic: 82000, total_pages: 195 },

  ],
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
    {
      company: 'Workday',
      title: 'Workday Adaptive Planning: What\'s New in Spring 2026',
      content_type: 'Release Note',
      date: 'Mar 2, 2026',
      topics: ['Product Update', 'FP&A'],
      notable: true,
      summary: 'Major update to Adaptive Planning with new scenario modeling and AI-powered variance analysis.',
      key_takeaway: 'Workday is bundling AI into their planning suite — positions them to absorb mid-market FP&A demand that Planful targets.',
      url: '#',
    },
    {
      company: 'OneStream',
      title: 'How to Unify Financial Close Across 50+ Entities',
      content_type: 'Whitepaper',
      date: 'Feb 28, 2026',
      topics: ['Financial Close', 'Enterprise'],
      notable: false,
      summary: 'Gated whitepaper targeting large enterprises with complex multi-entity consolidation needs.',
      key_takeaway: 'OneStream is going upmarket with enterprise complexity messaging — directly competing with BlackLine for large deals.',
      url: '#',
    },
  ],
  publishing_cadence: [
    { name: 'Workday', posts_30d: 22, posts_90d: 58, posts_180d: 110, avg_per_month: 18, trend: 'steady', content_mix: { Blog: 30, 'Case Study': 20, Video: 15, Whitepaper: 10, 'Release Note': 15, 'Press Release': 10 }, format_gaps: [] },
    { name: 'Flowcast', posts_30d: 16, posts_90d: 38, posts_180d: 72, avg_per_month: 13, trend: 'accelerating', content_mix: { Blog: 45, 'Case Study': 15, Video: 20, Whitepaper: 10, 'Release Note': 10 }, format_gaps: [] },
    { name: 'BlackLine', posts_30d: 12, posts_90d: 35, posts_180d: 68, avg_per_month: 11, trend: 'steady', content_mix: { Blog: 35, 'Case Study': 25, 'Press Release': 15, Whitepaper: 15, Video: 10 }, format_gaps: [] },
    { name: 'Planful', posts_30d: 11, posts_90d: 28, posts_180d: 51, avg_per_month: 9, trend: 'accelerating', content_mix: { Blog: 40, Whitepaper: 30, 'Release Note': 15, Video: 15 }, format_gaps: ['Case Study'] },
    { name: 'OneStream', posts_30d: 9, posts_90d: 24, posts_180d: 46, avg_per_month: 8, trend: 'steady', content_mix: { Blog: 35, Whitepaper: 25, 'Case Study': 20, 'Press Release': 10, Video: 10 }, format_gaps: [] },
    { name: 'HighRadius', posts_30d: 8, posts_90d: 22, posts_180d: 43, avg_per_month: 7, trend: 'steady', content_mix: { Blog: 60, 'Case Study': 20, 'Release Note': 20 }, format_gaps: ['Video', 'Whitepaper'] },
  ],
  theme_clusters: [
    {
      theme: 'AI-Powered Automation',
      total_pieces: 22,
      trend: 'accelerating',
      competitors: [{ name: 'Flowcast', count: 8 }, { name: 'Workday', count: 6 }, { name: 'Planful', count: 4 }, { name: 'BlackLine', count: 2 }, { name: 'OneStream', count: 2 }],
      your_coverage: 3,
      insight: 'Flowcast and Workday are leading AI content output. Workday\'s 6 pieces focus on planning AI while Flowcast targets AR AI — different angles, both outpacing you.',
    },
    {
      theme: 'Financial Close Optimization',
      total_pieces: 16,
      trend: 'steady',
      competitors: [{ name: 'BlackLine', count: 6 }, { name: 'OneStream', count: 4 }, { name: 'Planful', count: 3 }, { name: 'Workday', count: 3 }],
      your_coverage: 5,
      insight: 'BlackLine and OneStream dominate with enterprise case studies. Your coverage is solid but lacks named Fortune 500 logos.',
    },
    {
      theme: 'NetSuite / ERP Integration',
      total_pieces: 11,
      trend: 'accelerating',
      competitors: [{ name: 'Flowcast', count: 5 }, { name: 'BlackLine', count: 2 }, { name: 'Workday', count: 2 }],
      your_coverage: 0,
      insight: 'Flowcast is aggressively targeting NetSuite users with 5 pieces. Zero content from you — critical gap.',
    },
    {
      theme: 'Compliance & Audit Readiness',
      total_pieces: 10,
      trend: 'steady',
      competitors: [{ name: 'BlackLine', count: 4 }, { name: 'OneStream', count: 3 }, { name: 'Planful', count: 2 }, { name: 'Workday', count: 1 }],
      your_coverage: 1,
      insight: 'BlackLine and OneStream lead compliance content. Your single piece is outdated — SOX compliance is evergreen demand.',
    },
    {
      theme: 'Mid-Market FP&A',
      total_pieces: 14,
      trend: 'accelerating',
      competitors: [{ name: 'Planful', count: 5 }, { name: 'Workday', count: 3 }, { name: 'OneStream', count: 2 }],
      your_coverage: 0,
      insight: 'Planful owns mid-market FP&A content. Workday is moving in with 3 pieces. You have zero presence in this segment.',
    },
    {
      theme: 'Cash Flow Forecasting',
      total_pieces: 8,
      trend: 'steady',
      competitors: [{ name: 'Flowcast', count: 3 }, { name: 'Workday', count: 2 }, { name: 'Planful', count: 1 }],
      your_coverage: 2,
      insight: 'Competitive coverage — Flowcast and Workday publish more frequently here. Your 2 pieces need updating.',
    },
    {
      theme: 'Enterprise Planning & Consolidation',
      total_pieces: 12,
      trend: 'steady',
      competitors: [{ name: 'Workday', count: 5 }, { name: 'OneStream', count: 4 }, { name: 'BlackLine', count: 3 }],
      your_coverage: 0,
      insight: 'Workday and OneStream dominate enterprise consolidation content. If you compete upmarket, this is a significant blind spot.',
    },
  ],
  content_gaps: [
    {
      topic: 'NetSuite Integration Guides',
      severity: 'critical',
      competitors: [{ name: 'Flowcast', count: 5 }, { name: 'BlackLine', count: 2 }],
      sample_titles: ['NetSuite Advanced: How to Eliminate Manual Journal Entries', 'The Complete Guide to NetSuite AR Automation', 'Why Middleware is Killing Your NetSuite ROI'],
      recommendation: 'Create a comprehensive NetSuite integration guide targeting mid-market finance teams. Differentiate by covering multi-subsidiary scenarios that Flowcast doesn\'t address.',
    },
    {
      topic: 'Mid-Market FP&A Use Cases',
      severity: 'critical',
      competitors: [{ name: 'Planful', count: 5 }, { name: 'Workday', count: 3 }],
      sample_titles: ['FP&A for Growing Companies: When Spreadsheets Break', 'Excel-Native FP&A: Why Finance Teams Shouldn\'t Abandon Spreadsheets', 'The CFO\'s Guide to Consolidation Without an Enterprise Tool'],
      recommendation: 'Planful and Workday own this space. Start with a "vs spreadsheets" angle — Planful pushes migration, Workday targets enterprise. Find your mid-market position.',
    },
    {
      topic: 'Enterprise Consolidation',
      severity: 'critical',
      competitors: [{ name: 'Workday', count: 5 }, { name: 'OneStream', count: 4 }, { name: 'BlackLine', count: 3 }],
      sample_titles: ['How to Unify Financial Close Across 50+ Entities', 'Workday Adaptive Planning: Enterprise Consolidation Guide'],
      recommendation: 'Workday and OneStream dominate here. If you target enterprise, create consolidation content focusing on speed-to-close as differentiator.',
    },
    {
      topic: 'AI in Financial Operations',
      severity: 'high',
      competitors: [{ name: 'Flowcast', count: 8 }, { name: 'Workday', count: 6 }, { name: 'Planful', count: 4 }],
      sample_titles: ['How AI Is Transforming Accounts Receivable in 2026', 'AI Forecasting: From Buzzword to Board-Ready'],
      recommendation: 'You have 3 pieces but competitors have 18 combined. Publish a definitive guide — position as "honest AI" vs competitors\' marketing hype.',
    },
    {
      topic: 'SOX Compliance Automation',
      severity: 'medium',
      competitors: [{ name: 'BlackLine', count: 4 }, { name: 'OneStream', count: 3 }],
      sample_titles: ['SOX Compliance in 2026: What\'s Changed', 'Automating SOX Controls Without the Audit Anxiety'],
      recommendation: 'BlackLine and OneStream own compliance content. Their focus is enterprise — there\'s a mid-market angle available for you.',
    },
  ],
  keyword_landscape: {
    missing_keywords: [
      { keyword: 'netsuite accounts receivable automation', search_volume: 2400, competitors_ranking: [{ name: 'Flowcast', position: 3 }, { name: 'BlackLine', position: 7 }] },
      { keyword: 'FP&A software mid market', search_volume: 1800, competitors_ranking: [{ name: 'Planful', position: 2 }, { name: 'Workday', position: 8 }] },
      { keyword: 'AI cash application', search_volume: 1200, competitors_ranking: [{ name: 'Flowcast', position: 1 }, { name: 'Workday', position: 9 }] },
      { keyword: 'financial close automation SOX', search_volume: 900, competitors_ranking: [{ name: 'BlackLine', position: 4 }, { name: 'OneStream', position: 6 }] },
      { keyword: 'accounts receivable AI software', search_volume: 3100, competitors_ranking: [{ name: 'Flowcast', position: 2 }, { name: 'BlackLine', position: 5 }, { name: 'Workday', position: 11 }] },
      { keyword: 'enterprise financial consolidation', search_volume: 2900, competitors_ranking: [{ name: 'Workday', position: 1 }, { name: 'OneStream', position: 3 }, { name: 'BlackLine', position: 6 }] },
      { keyword: 'excel FP&A alternative', search_volume: 1500, competitors_ranking: [{ name: 'Planful', position: 2 }, { name: 'Workday', position: 6 }] },
    ],
    movers: [
      { keyword: 'autonomous finance platform', competitor: 'Flowcast', direction: 'up', change: 12, new_position: 4 },
      { keyword: 'financial close software', competitor: 'BlackLine', direction: 'up', change: 3, new_position: 1 },
      { keyword: 'FP&A consolidation tool', competitor: 'Planful', direction: 'up', change: 8, new_position: 3 },
      { keyword: 'AI financial planning', competitor: 'Workday', direction: 'up', change: 6, new_position: 2 },
      { keyword: 'enterprise planning software', competitor: 'OneStream', direction: 'up', change: 5, new_position: 4 },
      { keyword: 'AR automation pricing', competitor: 'Flowcast', direction: 'down', change: 5, new_position: 11 },
    ],
  },
  strategic_insights: [
    {
      priority: 'high',
      type: 'Content Strategy Shift',
      category: 'content',
      observation: 'Flowcast published 8 AI-focused content pieces in 30 days — 3x their historical average. Their messaging has shifted from "automation" to "autonomous finance," signaling a deliberate repositioning.',
      implication: 'Flowcast is establishing AI thought leadership in AR. If unchecked, they will own the "AI in finance" search narrative within 2 quarters. Your 3 AI pieces are being outpaced.',
      action: 'Publish a definitive "State of AI in Financial Operations" guide within 2 weeks. Use your claims audit data to challenge Flowcast\'s "autonomous" claims with evidence-backed analysis — a differentiated angle they can\'t match.',
    },
    {
      priority: 'high',
      type: 'Content Gap',
      category: 'seo',
      observation: 'Zero content presence in NetSuite integration — a keyword cluster with 7,500+ monthly search volume where Flowcast has 5 ranking pieces and BlackLine has 2.',
      implication: 'You are invisible to the entire NetSuite buyer segment. Any prospect searching for NetSuite + AR/finance automation will find competitors only.',
      action: 'Create a "NetSuite Integration Hub" — 3 pieces targeting different intent levels: a comparison page (BOFU), a how-to guide (MOFU), and a "signs you need automation" post (TOFU). Prioritize the comparison page for fastest ranking.',
    },
    {
      priority: 'medium',
      type: 'Format Gap',
      category: 'content',
      observation: 'You produce zero video content. Flowcast publishes 20% video (webinars, demos). BlackLine uses video for customer stories. Industry average is 15% video mix.',
      implication: 'Video content has 2x engagement vs blog in B2B finance (BuzzSumo data). Missing this format means lower social shares and reduced LLM training data inclusion.',
      action: 'Start with monthly webinars on topics where you have expertise. Record customer testimonials. Repurpose into short LinkedIn clips — this serves both content and social strategy.',
    },
    {
      priority: 'medium',
      type: 'Competitive Opportunity',
      category: 'strategy',
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
    { name: 'Workday', logo_url: null },
    { name: 'OneStream', logo_url: null },
  ],
};


export default function ContentIntelPageV2() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  const hasRealData = data?.content_intel;
  const displayData = hasRealData ? data.content_intel : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

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

      <ContentIntelV2 data={displayData} meta={displayMeta} />
    </div>
  );
}
