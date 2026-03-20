import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import TrafficSEO from '../components/feature-report/TrafficSEO';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, Globe } from 'lucide-react';

/* ─── Sample data for visualization (HighRadius vs competitors) ─── */
const SAMPLE_DATA = {
  scorecard: {
    your_organic_traffic: 185000,
    your_da: 62,
    your_keywords: 4800,
    your_traffic_value: 892000,
    keyword_gaps: 23,
  },

  traffic_overview: [
    { name: 'Workday', monthly_traffic: 2400000, trend: 'steady', change_pct: 5, is_you: false },
    { name: 'BlackLine', monthly_traffic: 310000, trend: 'growing', change_pct: 12, is_you: false },
    { name: 'HighRadius', monthly_traffic: 185000, trend: 'steady', change_pct: 3, is_you: true },
    { name: 'Planful', monthly_traffic: 145000, trend: 'growing', change_pct: 18, is_you: false },
    { name: 'OneStream', monthly_traffic: 120000, trend: 'growing', change_pct: 15, is_you: false },

    { name: 'Flowcast', monthly_traffic: 82000, trend: 'accelerating', change_pct: 42, is_you: false },
  ],

  domain_authority: [
    { name: 'Workday', domain: 'workday.com', da: 89, referring_domains: 52000, total_backlinks: 3200000, new_backlinks_30d: 8500, velocity_trend: 'steady', is_you: false },
    { name: 'BlackLine', domain: 'blackline.com', da: 71, referring_domains: 8200, total_backlinks: 245000, new_backlinks_30d: 1200, velocity_trend: 'steady', is_you: false },
    { name: 'HighRadius', domain: 'highradius.com', da: 62, referring_domains: 4100, total_backlinks: 128000, new_backlinks_30d: 450, velocity_trend: 'steady', is_you: true },
    { name: 'Planful', domain: 'planful.com', da: 58, referring_domains: 3600, total_backlinks: 95000, new_backlinks_30d: 800, velocity_trend: 'growing', is_you: false },
    { name: 'OneStream', domain: 'onestream.com', da: 55, referring_domains: 2800, total_backlinks: 72000, new_backlinks_30d: 520, velocity_trend: 'growing', is_you: false },

    { name: 'Flowcast', domain: 'flowcast.ai', da: 45, referring_domains: 1200, total_backlinks: 18000, new_backlinks_30d: 650, velocity_trend: 'accelerating', is_you: false },
  ],

  keyword_rankings: [
    { keyword: 'accounts receivable automation', volume: 8100, intent: 'commercial', rankings: [
      { name: 'HighRadius', position: 4, change: 2 }, { name: 'BlackLine', position: 7, change: -1 }, { name: 'Flowcast', position: 12, change: 5 }, { name: 'Workday', position: 15, change: 0 }, { name: 'Planful', position: null, change: null }, { name: 'OneStream', position: null, change: null },    ]},
    { keyword: 'financial close software', volume: 6600, intent: 'commercial', rankings: [
      { name: 'BlackLine', position: 1, change: 0 }, { name: 'Planful', position: 6, change: 3 }, { name: 'OneStream', position: 5, change: 2 }, { name: 'HighRadius', position: 8, change: -2 }, { name: 'Workday', position: 10, change: -1 }, { name: 'Flowcast', position: null, change: null },    ]},
    { keyword: 'what is accounts receivable', volume: 22000, intent: 'informational', rankings: [
      { name: 'HighRadius', position: 3, change: 1 }, { name: 'Workday', position: 6, change: 0 }, { name: 'BlackLine', position: 11, change: -3 }, { name: 'Flowcast', position: 18, change: 0 }, { name: 'Planful', position: null, change: null }, { name: 'OneStream', position: null, change: null },    ]},
    { keyword: 'FP&A software', volume: 4400, intent: 'commercial', rankings: [
      { name: 'Planful', position: 2, change: 0 }, { name: 'Workday', position: 3, change: -1 }, { name: 'OneStream', position: 8, change: 0 }, { name: 'BlackLine', position: 9, change: -1 }, { name: 'HighRadius', position: null, change: null }, { name: 'Flowcast', position: null, change: null },
    ]},
    { keyword: 'cash application automation', volume: 3200, intent: 'transactional', rankings: [
      { name: 'Flowcast', position: 1, change: 3 }, { name: 'HighRadius', position: 2, change: 0 }, { name: 'BlackLine', position: 5, change: -2 }, { name: 'Workday', position: 18, change: 0 }, { name: 'Planful', position: null, change: null }, { name: 'OneStream', position: null, change: null },    ]},
    { keyword: 'how to reduce DSO', volume: 2900, intent: 'informational', rankings: [
      { name: 'HighRadius', position: 5, change: -1 }, { name: 'Flowcast', position: 9, change: 4 }, { name: 'BlackLine', position: 14, change: 0 }, { name: 'Workday', position: 12, change: 0 }, { name: 'Planful', position: null, change: null }, { name: 'OneStream', position: null, change: null },    ]},
    { keyword: 'order to cash process', volume: 5500, intent: 'informational', rankings: [
      { name: 'HighRadius', position: 1, change: 0 }, { name: 'Workday', position: 4, change: 1 }, { name: 'BlackLine', position: 8, change: 2 }, { name: 'Flowcast', position: 15, change: -3 }, { name: 'Planful', position: 22, change: 0 }, { name: 'OneStream', position: null, change: null },    ]},
    { keyword: 'netsuite accounts receivable', volume: 2400, intent: 'navigational', rankings: [
      { name: 'Flowcast', position: 3, change: 2 }, { name: 'BlackLine', position: 7, change: 0 }, { name: 'HighRadius', position: null, change: null }, { name: 'Workday', position: null, change: null }, { name: 'Planful', position: null, change: null }, { name: 'OneStream', position: null, change: null },
    ]},
    { keyword: 'enterprise financial consolidation', volume: 2900, intent: 'commercial', rankings: [
      { name: 'Workday', position: 1, change: 0 }, { name: 'OneStream', position: 3, change: 1 }, { name: 'BlackLine', position: 6, change: -2 }, { name: 'HighRadius', position: null, change: null }, { name: 'Planful', position: 11, change: 0 }, { name: 'Flowcast', position: null, change: null },    ]},
  ],

  keyword_gaps: [
    { keyword: 'netsuite accounts receivable automation', volume: 2400, cpc: 12.80, difficulty: 45, priority: 'critical', competitors_ranking: [{ name: 'Flowcast', position: 3 }, { name: 'BlackLine', position: 7 }], recommendation: 'Create a comprehensive NetSuite integration landing page. Flowcast owns this cluster — you have zero pages targeting it.' },
    { keyword: 'enterprise financial consolidation', volume: 2900, cpc: 24.50, difficulty: 58, priority: 'critical', competitors_ranking: [{ name: 'Workday', position: 1 }, { name: 'OneStream', position: 3 }, { name: 'BlackLine', position: 6 }], recommendation: 'Workday and OneStream dominate consolidation. If you compete upmarket, build an enterprise consolidation landing page highlighting speed-to-close.' },
    { keyword: 'FP&A software mid market', volume: 1800, cpc: 18.50, difficulty: 52, priority: 'high', competitors_ranking: [{ name: 'Planful', position: 2 }, { name: 'Workday', position: 8 }], recommendation: 'Planful and Workday rank here. Build a comparison page targeting mid-market CFOs.' },
    { keyword: 'AI cash application software', volume: 1200, cpc: 22.40, difficulty: 38, priority: 'critical', competitors_ranking: [{ name: 'Flowcast', position: 1 }, { name: 'Workday', position: 9 }], recommendation: 'Flowcast ranks #1 for your core AI capability. Create a definitive guide leveraging your patent data and real customer metrics.' },
    { keyword: 'financial close automation SOX compliance', volume: 900, cpc: 15.20, difficulty: 41, priority: 'medium', competitors_ranking: [{ name: 'BlackLine', position: 4 }, { name: 'OneStream', position: 6 }], recommendation: 'BlackLine and OneStream own SOX content but target enterprise — mid-market angle is available.' },
    { keyword: 'excel FP&A alternative', volume: 1500, cpc: 14.00, difficulty: 32, priority: 'high', competitors_ranking: [{ name: 'Planful', position: 2 }, { name: 'Workday', position: 6 }], recommendation: 'High intent keyword. Create a comparison page showing your platform vs spreadsheet-based workflows.' },
  ],

  top_pages: [
    { company: 'Workday', title: 'What Is Enterprise Financial Consolidation?', path: '/resources/consolidation-guide', traffic: 42000, keyword_count: 580, top_keyword: 'financial consolidation' },
    { company: 'BlackLine', title: 'What Is Financial Close Management?', path: '/resources/blog/financial-close-management', traffic: 18500, keyword_count: 340, top_keyword: 'financial close management' },
    { company: 'BlackLine', title: 'BlackLine vs Competitors Comparison', path: '/why-blackline/compare', traffic: 12200, keyword_count: 180, top_keyword: 'blackline competitors' },
    { company: 'Flowcast', title: 'AI-Powered Cash Application: Complete Guide', path: '/blog/ai-cash-application-guide', traffic: 9800, keyword_count: 220, top_keyword: 'AI cash application' },
    { company: 'Planful', title: 'FP&A Software for Growing Companies', path: '/solutions/fpa-software', traffic: 8400, keyword_count: 150, top_keyword: 'FP&A software' },
    { company: 'Workday', title: 'Adaptive Planning: AI Forecasting', path: '/products/adaptive-planning', traffic: 8100, keyword_count: 290, top_keyword: 'adaptive planning' },
    { company: 'Flowcast', title: 'NetSuite AR Automation Integration', path: '/integrations/netsuite', traffic: 7200, keyword_count: 95, top_keyword: 'netsuite accounts receivable' },
    { company: 'OneStream', title: 'Unified Financial Close Platform', path: '/solutions/financial-close', traffic: 6300, keyword_count: 105, top_keyword: 'financial close platform' },
    { company: 'BlackLine', title: 'SOX Compliance Automation Guide', path: '/resources/sox-compliance', traffic: 6100, keyword_count: 110, top_keyword: 'SOX compliance automation' },
  ],

  traffic_sources: [
    { name: 'HighRadius', is_you: true, channels: { 'Organic Search': 52, 'Paid Search': 18, 'Direct': 15, 'Referral': 8, 'Social': 5, 'Email': 2 } },
    { name: 'Workday', is_you: false, channels: { 'Organic Search': 45, 'Paid Search': 25, 'Direct': 20, 'Referral': 5, 'Social': 3, 'Email': 2 } },
    { name: 'BlackLine', is_you: false, channels: { 'Organic Search': 48, 'Paid Search': 22, 'Direct': 18, 'Referral': 6, 'Social': 4, 'Email': 2 } },
    { name: 'Planful', is_you: false, channels: { 'Organic Search': 55, 'Paid Search': 12, 'Direct': 14, 'Referral': 10, 'Social': 6, 'Email': 3 } },
    { name: 'OneStream', is_you: false, channels: { 'Organic Search': 50, 'Paid Search': 20, 'Direct': 16, 'Referral': 7, 'Social': 5, 'Email': 2 } },
    { name: 'Flowcast', is_you: false, channels: { 'Organic Search': 62, 'Paid Search': 8, 'Direct': 10, 'Referral': 5, 'Social': 12, 'Email': 3 } },
  ],

  strategic_insights: [
    {
      priority: 'high',
      type: 'Backlink Authority Gap',
      category: 'seo',
      observation: 'BlackLine has 2x your referring domains (8,200 vs 4,100) and 71 DA vs your 62. Flowcast is gaining backlinks at the fastest rate (+650/month) despite being the smallest player.',
      implication: 'Domain authority directly impacts keyword ranking ceilings. At DA 62, you\'ll struggle to outrank BlackLine (DA 71) for competitive commercial keywords even with better content.',
      action: 'Launch a link-building campaign targeting industry publications and fintech blogs. Create linkable assets — original research reports, interactive tools (like your pricing calculator concept), and data-driven analyses that earn natural backlinks.',
    },
    {
      priority: 'high',
      type: 'Keyword Blindspot',
      category: 'seo',
      observation: 'You rank for 0 keywords in the NetSuite integration cluster (2,400+ monthly search volume) and 0 in mid-market FP&A (1,800+ volume). Flowcast has 3 pages ranking for NetSuite terms; Planful owns FP&A entirely.',
      implication: 'Any prospect searching for NetSuite + AR automation or mid-market FP&A will find only competitors. These are purchase-intent queries — the traffic you\'re missing has high conversion potential.',
      action: 'Create a "NetSuite Integration Hub" with 3 pages: a product landing page (BOFU), a how-to guide (MOFU), and a "when to automate AR" educational post (TOFU). Prioritize the landing page for fastest commercial impact.',
    },
    {
      priority: 'medium',
      type: 'Channel Mix Opportunity',
      category: 'traffic',
      observation: 'Flowcast gets 12% of traffic from social (vs your 5%) and 62% from organic (vs your 52%). Their social-heavy strategy is driving both traffic and backlinks through content amplification.',
      implication: 'Your over-indexing on paid search (18%) vs Flowcast\'s 8% suggests a dependency on paid acquisition. When paid budgets tighten, organic + social provides a more sustainable traffic floor.',
      action: 'Increase social distribution: repurpose top-performing blog content into LinkedIn carousels and short video clips. Target 3x current social posting frequency. Redirect 5% of paid search budget to content creation for organic growth.',
    },
    {
      priority: 'medium',
      type: 'Traffic Concentration Risk',
      category: 'traffic',
      observation: 'Workday drives 2.4M monthly visits — 13x your traffic. BlackLine at 310k is the realistic benchmark. Your traffic gap with BlackLine (310k vs 185k) is 40%, primarily from their stronger DA and deeper content library.',
      implication: 'BlackLine\'s top pages alone (financial close management guide + comparison page) drive ~30k visits — that\'s 16% of your entire organic traffic from just 2 pages.',
      action: 'Identify your top 5 traffic-driving pages and create 2-3 "pillar" pages targeting high-volume informational keywords (like "what is order to cash") where you already rank. Optimize these for featured snippets to capture more SERP real estate.',
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


export default function TrafficSEOPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  const hasRealData = data?.traffic_seo;
  const displayData = hasRealData ? data.traffic_seo : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  if (projectId && loading) {
    return <Spinner text="Loading traffic & SEO intelligence..." subtext="Checking for cached report data" />;
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
          <div className="report-error-title">Failed to load traffic & SEO intelligence</div>
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
            <Globe size={24} style={{ color: 'var(--azure)' }} />
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>Traffic & SEO Intelligence</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Compare organic traffic, keyword rankings, backlink profiles, and AI search visibility across competitors
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

      <TrafficSEO data={displayData} meta={displayMeta} />
    </div>
  );
}
