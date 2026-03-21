import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import PaidChannels from '../components/feature-report/PaidChannels';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, BarChart3 } from 'lucide-react';

const SAMPLE_DATA = {
  scorecard: {
    your_paid_keywords: 1240,
    keyword_gaps: 14,
    brand_terms_attacked: 4,
    new_ads_30d: 8,
    channels_active: 'Google, LinkedIn',
  },

  paid_activity: [
    { name: 'HighRadius', is_you: true, paid_keywords: 1240, ads_by_channel: { 'Google Ads': 18, 'LinkedIn': 6, 'Meta': 0, 'YouTube': 2 }, trend: 'steady' },
    { name: 'BlackLine', is_you: false, paid_keywords: 2100, ads_by_channel: { 'Google Ads': 32, 'LinkedIn': 14, 'Meta': 0, 'YouTube': 4 }, trend: 'increasing' },
    { name: 'Flowcast', is_you: false, paid_keywords: 680, ads_by_channel: { 'Google Ads': 15, 'LinkedIn': 3, 'Meta': 8, 'YouTube': 0 }, trend: 'increasing' },
    { name: 'Planful', is_you: false, paid_keywords: 890, ads_by_channel: { 'Google Ads': 12, 'LinkedIn': 5, 'Meta': 0, 'YouTube': 0 }, trend: 'steady' },
    { name: 'Workday', is_you: false, paid_keywords: 4200, ads_by_channel: { 'Google Ads': 45, 'LinkedIn': 22, 'Meta': 6, 'YouTube': 8 }, trend: 'steady' },
    { name: 'OneStream', is_you: false, paid_keywords: 1100, ads_by_channel: { 'Google Ads': 14, 'LinkedIn': 8, 'Meta': 0, 'YouTube': 2 }, trend: 'increasing' },
  ],

  paid_trend: [
    { name: 'HighRadius', is_you: true, ads_now: 26, ads_30d_ago: 24, keywords_now: 1240, keywords_30d_ago: 1180, signal: 'Steady' },
    { name: 'BlackLine', is_you: false, ads_now: 50, ads_30d_ago: 38, keywords_now: 2100, keywords_30d_ago: 1750, signal: 'Ramping Up' },
    { name: 'Flowcast', is_you: false, ads_now: 26, ads_30d_ago: 14, keywords_now: 680, keywords_30d_ago: 420, signal: 'Ramping Up' },
    { name: 'Planful', is_you: false, ads_now: 17, ads_30d_ago: 19, keywords_now: 890, keywords_30d_ago: 920, signal: 'Pulling Back' },
    { name: 'Workday', is_you: false, ads_now: 81, ads_30d_ago: 78, keywords_now: 4200, keywords_30d_ago: 4050, signal: 'Steady' },
    { name: 'OneStream', is_you: false, ads_now: 24, ads_30d_ago: 16, keywords_now: 1100, keywords_30d_ago: 850, signal: 'Ramping Up' },
  ],

  keyword_landscape: [
    { keyword: 'accounts receivable automation software', volume: 8100, avg_cpc: 18.50, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: ['BlackLine', 'Flowcast', 'Workday'] },
    { keyword: 'financial close software', volume: 6600, avg_cpc: 22.40, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['BlackLine', 'OneStream', 'Workday'] },
    { keyword: 'order to cash automation', volume: 2900, avg_cpc: 12.80, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: ['BlackLine'] },
    { keyword: 'FP&A software', volume: 4400, avg_cpc: 16.80, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['Planful', 'Workday', 'OneStream'] },
    { keyword: 'cash application automation', volume: 3200, avg_cpc: 14.20, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: ['Flowcast', 'BlackLine'] },
    { keyword: 'AI accounts receivable', volume: 1800, avg_cpc: 15.60, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['Flowcast', 'Workday'] },
    { keyword: 'enterprise financial consolidation', volume: 2900, avg_cpc: 24.50, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['Workday', 'OneStream', 'BlackLine'] },
    { keyword: 'netsuite AR automation', volume: 2400, avg_cpc: 11.20, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['Flowcast'] },
    { keyword: 'how to reduce DSO', volume: 2900, avg_cpc: 8.40, intent: 'informational', channel: 'Google Ads', you_bid: true, competitors_bidding: ['Flowcast'] },
    { keyword: 'accounts receivable dashboard', volume: 3100, avg_cpc: 8.90, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['Flowcast', 'BlackLine'] },
    { keyword: 'automated invoice processing', volume: 5200, avg_cpc: 12.10, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: ['Workday', 'BlackLine'] },
    { keyword: 'deductions management software', volume: 1400, avg_cpc: 19.80, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: [] },
    { keyword: 'credit risk management software', volume: 1900, avg_cpc: 16.40, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: [] },
    { keyword: 'SOX compliance automation', volume: 900, avg_cpc: 15.20, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['BlackLine', 'OneStream'] },
    { keyword: 'financial close management', volume: 4200, avg_cpc: 20.10, intent: 'commercial', channel: 'Google Ads', you_bid: false, competitors_bidding: ['BlackLine', 'Workday'] },
    { keyword: 'collections management software', volume: 1600, avg_cpc: 13.50, intent: 'commercial', channel: 'Google Ads', you_bid: true, competitors_bidding: ['BlackLine'] },
    { keyword: 'CFO finance automation', volume: 1200, avg_cpc: 28.00, intent: 'commercial', channel: 'LinkedIn', you_bid: true, competitors_bidding: ['BlackLine', 'Workday'] },
    { keyword: 'AR automation for finance teams', volume: 900, avg_cpc: 32.00, intent: 'commercial', channel: 'LinkedIn', you_bid: false, competitors_bidding: ['Flowcast', 'BlackLine'] },
  ],

  brand_keywords: [
    { keyword: 'highradius', volume: 8100, threat: 'high', channel: 'Google Ads', bidders: [{ name: 'BlackLine', ad_position: 1 }, { name: 'Flowcast', ad_position: 3 }] },
    { keyword: 'highradius alternative', volume: 1900, threat: 'high', channel: 'Google Ads', bidders: [{ name: 'BlackLine', ad_position: 1 }, { name: 'Planful', ad_position: 2 }, { name: 'Flowcast', ad_position: 4 }] },
    { keyword: 'highradius pricing', volume: 1200, threat: 'high', channel: 'Google Ads', bidders: [{ name: 'BlackLine', ad_position: 2 }] },
    { keyword: 'highradius vs blackline', volume: 880, threat: 'medium', channel: 'Google Ads', bidders: [{ name: 'BlackLine', ad_position: 1 }] },
    { keyword: 'highradius reviews', volume: 720, threat: 'medium', channel: 'Google Ads', bidders: [{ name: 'BlackLine', ad_position: 2 }, { name: 'OneStream', ad_position: 4 }] },
    { keyword: 'highradius demo', volume: 590, threat: 'low', channel: 'Google Ads', bidders: [] },
    { keyword: 'highradius careers', volume: 2400, threat: 'low', channel: 'Google Ads', bidders: [] },
  ],

  ad_themes: [
    {
      theme: 'AI-Powered Automation',
      trend: 'growing',
      keywords_count: 18,
      channels: { 'Google Ads': 14, 'LinkedIn': 6, 'Meta': 3 },
      your_ads: 4,
      competitors: [
        { name: 'Flowcast', ads: 10, intensity: 'high', by_channel: { 'Google Ads': 5, 'LinkedIn': 2, 'Meta': 3 } },
        { name: 'BlackLine', ads: 5, intensity: 'medium', by_channel: { 'Google Ads': 4, 'LinkedIn': 1 } },
        { name: 'Workday', ads: 4, intensity: 'low', by_channel: { 'Google Ads': 2, 'LinkedIn': 2 } },
      ],
      sample_keywords: ['AI cash application', 'AI accounts receivable', 'autonomous finance platform', 'AI-powered AR', 'machine learning finance'],
      insight: 'Flowcast is spending heavily across all 3 channels on AI messaging — they\'re trying to own "AI + AR" in paid search before you do. Their Meta presence (3 ads) suggests they\'re testing social for demand gen, not just Google.',
    },
    {
      theme: 'Financial Close & Consolidation',
      trend: 'steady',
      keywords_count: 24,
      channels: { 'Google Ads': 18, 'LinkedIn': 8 },
      your_ads: 2,
      competitors: [
        { name: 'BlackLine', ads: 14, intensity: 'high', by_channel: { 'Google Ads': 10, 'LinkedIn': 4 } },
        { name: 'Workday', ads: 8, intensity: 'medium', by_channel: { 'Google Ads': 4, 'LinkedIn': 4 } },
        { name: 'OneStream', ads: 6, intensity: 'medium', by_channel: { 'Google Ads': 4, 'LinkedIn': 2 } },
      ],
      sample_keywords: ['financial close software', 'financial close management', 'month-end close automation', 'SOX compliance automation', 'enterprise consolidation'],
      insight: 'BlackLine dominates this theme with 14 ads across Google + LinkedIn. They\'re spending heavily on both search capture (Google) and awareness (LinkedIn CFO targeting). You have only 2 ads here.',
    },
    {
      theme: 'NetSuite & ERP Integration',
      trend: 'growing',
      keywords_count: 8,
      channels: { 'Google Ads': 6, 'LinkedIn': 1 },
      your_ads: 0,
      competitors: [
        { name: 'Flowcast', ads: 5, intensity: 'high', by_channel: { 'Google Ads': 4, 'LinkedIn': 1 } },
        { name: 'BlackLine', ads: 2, intensity: 'low', by_channel: { 'Google Ads': 2 } },
      ],
      sample_keywords: ['netsuite AR automation', 'netsuite accounts receivable', 'ERP AR integration', 'netsuite cash application'],
      insight: 'You have zero paid presence in NetSuite integration — a growing theme where Flowcast is establishing dominance. Same blind spot as your organic SEO gap.',
    },
    {
      theme: 'Mid-Market FP&A',
      trend: 'steady',
      keywords_count: 12,
      channels: { 'Google Ads': 10, 'LinkedIn': 3 },
      your_ads: 0,
      competitors: [
        { name: 'Planful', ads: 8, intensity: 'high', by_channel: { 'Google Ads': 6, 'LinkedIn': 2 } },
        { name: 'Workday', ads: 5, intensity: 'medium', by_channel: { 'Google Ads': 4, 'LinkedIn': 1 } },
      ],
      sample_keywords: ['FP&A software', 'FP&A software mid market', 'budgeting software', 'financial planning tool', 'excel FP&A alternative'],
      insight: 'Only relevant if FP&A is in your ICP. Planful owns this theme entirely in paid. Their LinkedIn ads target FP&A Directors at $100M-1B companies.',
    },
    {
      theme: 'Brand Conquest (Competitor Names)',
      trend: 'growing',
      keywords_count: 14,
      channels: { 'Google Ads': 12, 'LinkedIn': 2 },
      your_ads: 3,
      competitors: [
        { name: 'BlackLine', ads: 8, intensity: 'high', by_channel: { 'Google Ads': 7, 'LinkedIn': 1 } },
        { name: 'Flowcast', ads: 4, intensity: 'medium', by_channel: { 'Google Ads': 3, 'LinkedIn': 1 } },
        { name: 'OneStream', ads: 2, intensity: 'low', by_channel: { 'Google Ads': 2 } },
      ],
      sample_keywords: ['highradius alternative', 'highradius vs blackline', 'blackline alternative', 'highradius pricing', 'blackline competitor'],
      insight: 'BlackLine is running 8 conquest ads targeting your brand + other competitor names. This is an aggressive brand intercept strategy — they\'re spending premium CPC to steal high-intent traffic.',
    },
  ],

  ad_copies: [
    { company: 'BlackLine', channel: 'Google Ads', headline: 'BlackLine vs HighRadius — See Why Leaders Choose BlackLine', description: 'Trusted by 4,400+ companies worldwide. Reduce financial close by 50%. Free demo available.', display_url: 'blackline.com/compare', landing_page: '/why-blackline/vs-highradius', detected_date: 'Mar 18, 2026', is_new: true },
    { company: 'Flowcast', channel: 'Google Ads', headline: 'AI-Powered Cash Application — 5x Faster Than Legacy Tools', description: 'Autonomous cash application with 98% match rate. No middleware needed. Close in 5 days.', display_url: 'flowcast.ai/cash-application', landing_page: '/product/cash-application', detected_date: 'Mar 15, 2026', is_new: true },
    { company: 'BlackLine', channel: 'LinkedIn', headline: 'The CFO\'s Guide to Financial Close Automation', description: 'Download the 2026 report. Learn how top finance teams cut close time by 40%.', display_url: 'blackline.com/resources', landing_page: '/resources/cfo-guide-2026', detected_date: 'Mar 12, 2026', is_new: false },
    { company: 'Planful', channel: 'Google Ads', headline: 'FP&A Software Built for Mid-Market — Start in 4 Weeks', description: 'Replace spreadsheets with connected planning. Rated #1 on G2 for ease of use.', display_url: 'planful.com/fpa', landing_page: '/solutions/fpa-software', detected_date: 'Mar 10, 2026', is_new: false },
    { company: 'Workday', channel: 'LinkedIn', headline: 'Adaptive Planning: AI-Powered Financial Planning', description: 'Unify planning, consolidation, and close on one platform. Trusted by 10,000+ organizations.', display_url: 'workday.com/adaptive', landing_page: '/products/adaptive-planning', detected_date: 'Mar 8, 2026', is_new: false },
    { company: 'Flowcast', channel: 'Meta', headline: 'Still doing manual cash application? There\'s a better way.', description: 'See how AI eliminates 90% of manual touchpoints in AR. Book a 15-min demo.', display_url: 'flowcast.ai', landing_page: '/demo', detected_date: 'Mar 5, 2026', is_new: false },
    { company: 'OneStream', channel: 'Google Ads', headline: 'Unified Platform for Financial Close & Consolidation', description: 'Replace point solutions. One platform for close, consolidation, planning & reporting.', display_url: 'onestream.com', landing_page: '/platform', detected_date: 'Mar 3, 2026', is_new: false },
  ],

  landing_pages: [
    { company: 'BlackLine', title: 'BlackLine vs HighRadius Comparison', url: 'blackline.com/why-blackline/vs-highradius', keywords_count: 12, page_type: 'comparison', channels: ['Google Ads'], is_new: true },
    { company: 'BlackLine', title: 'Financial Close Management Solution', url: 'blackline.com/solutions/financial-close', keywords_count: 28, page_type: 'product', channels: ['Google Ads', 'LinkedIn'], is_new: false },
    { company: 'Flowcast', title: 'AI Cash Application Platform', url: 'flowcast.ai/product/cash-application', keywords_count: 15, page_type: 'product', channels: ['Google Ads'], is_new: false },
    { company: 'Planful', title: 'FP&A Software for Growing Companies', url: 'planful.com/solutions/fpa-software', keywords_count: 18, page_type: 'product', channels: ['Google Ads'], is_new: false },
    { company: 'Workday', title: 'Adaptive Planning Overview', url: 'workday.com/products/adaptive-planning', keywords_count: 35, page_type: 'product', channels: ['LinkedIn', 'Google Ads'], is_new: false },
    { company: 'Flowcast', title: 'Book a Demo — Flowcast', url: 'flowcast.ai/demo', keywords_count: 8, page_type: 'demo', channels: ['Meta', 'Google Ads'], is_new: false },
    { company: 'OneStream', title: 'The OneStream Platform', url: 'onestream.com/platform', keywords_count: 22, page_type: 'product', channels: ['Google Ads'], is_new: false },
    { company: 'BlackLine', title: 'CFO Guide: Financial Close 2026', url: 'blackline.com/resources/cfo-guide-2026', keywords_count: 6, page_type: 'gated content', channels: ['LinkedIn'], is_new: true },
  ],

  recommendations: [
    { priority: 'high', type: 'Brand Defense', category: 'brand', observation: 'BlackLine is bidding #1 on "highradius alternative" and "highradius pricing." Their ad copy directly names you and positions BlackLine as superior.', implication: 'Prospects searching for your brand see BlackLine first. At $8.50 CPC for "highradius alternative," they\'re paying premium to intercept your traffic.', action: 'Increase bid on "highradius alternative" to reclaim #1. Create a dedicated comparison landing page that controls the narrative. Add sitelink extensions to all brand ads.' },
    { priority: 'high', type: 'Keyword Gap', category: 'paid search', observation: 'You have zero paid presence on "financial close software" (6.6K vol), "FP&A software" (4.4K vol), and "enterprise financial consolidation" (2.9K vol). All dominated by BlackLine, Workday, and OneStream.', implication: '14,000+ monthly commercial-intent searches where only competitors show up. If you compete in these segments, this is lost pipeline.', action: 'Launch test campaigns on "financial close software" first — highest volume, clearest commercial intent. Create dedicated landing pages for each keyword cluster.' },
    { priority: 'medium', type: 'Competitive Landing Page', category: 'paid search', observation: 'BlackLine just launched a "BlackLine vs HighRadius" comparison page and is driving 12 paid keywords to it. This page directly attacks your positioning.', implication: 'Any prospect searching for you vs BlackLine will land on a page BlackLine controls. You have no equivalent counter-page.', action: 'Create your own "HighRadius vs BlackLine" comparison page with objective data. Use your claims audit data as evidence. Bid on "blackline vs highradius" and "blackline alternative" keywords.' },
    { priority: 'medium', type: 'Ad Copy Messaging', category: 'paid search', observation: 'Flowcast\'s ads consistently use "5x faster" and "98% match rate" claims. These specific numbers are more compelling than generic benefit statements in your ads.', implication: 'Specific, quantified claims outperform generic copy. Flowcast has validated this messaging through ad rotation testing.', action: 'Update your ad copy to include specific metrics from customer outcomes. Test "reduce DSO by X days" or "Y% automation rate" headlines against current generic copy.' },
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


export default function PaidChannelsPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  const hasRealData = data?.paid_channels;
  const displayData = hasRealData ? data.paid_channels : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  if (projectId && loading) {
    return <Spinner text="Loading paid channels intelligence..." subtext="Checking for cached report data" />;
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
          <div className="report-error-title">Failed to load paid channels intelligence</div>
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
            <BarChart3 size={24} style={{ color: 'var(--azure)' }} />
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>Paid Channels Intelligence</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Track competitor PPC keywords, ad creatives, brand keyword bidding, and landing pages
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showSample && (
            <span style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase' }}>Sample Data</span>
          )}
          {projectId && (
            <button className="btn-secondary" onClick={refresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      <PaidChannels data={displayData} meta={displayMeta} />
    </div>
  );
}
