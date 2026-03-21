import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import MarketingOverview from '../components/feature-report/MarketingOverview';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, BarChart3 } from 'lucide-react';

/* ─── Sample data — aggregated from Content Intel, Traffic & SEO, Paid Channels, AEO ─── */
const SAMPLE_DATA = {
  scorecard: [
    { name: 'Workday', is_you: false, content_30d: 22, organic_traffic: 2400000, da: 89, organic_keywords: 42000, active_ads: 81, paid_keywords: 4200, ai_visibility: '68%', overall_signal: 'ahead' },
    { name: 'BlackLine', is_you: false, content_30d: 12, organic_traffic: 310000, da: 71, organic_keywords: 8400, active_ads: 50, paid_keywords: 2100, ai_visibility: '52%', overall_signal: 'ahead' },
    { name: 'HighRadius', is_you: true, content_30d: 8, organic_traffic: 185000, da: 62, organic_keywords: 4800, active_ads: 26, paid_keywords: 1240, ai_visibility: '34%', overall_signal: 'behind' },
    { name: 'Planful', is_you: false, content_30d: 11, organic_traffic: 145000, da: 58, organic_keywords: 3600, active_ads: 17, paid_keywords: 890, ai_visibility: '31%', overall_signal: 'on_par' },
    { name: 'OneStream', is_you: false, content_30d: 9, organic_traffic: 120000, da: 55, organic_keywords: 2800, active_ads: 24, paid_keywords: 1100, ai_visibility: '26%', overall_signal: 'behind' },
    { name: 'Flowcast', is_you: false, content_30d: 16, organic_traffic: 82000, da: 45, organic_keywords: 1200, active_ads: 26, paid_keywords: 680, ai_visibility: '42%', overall_signal: 'growing' },
  ],

  channels: [
    {
      channel: 'Content',
      status: 'behind',
      source_tab: 'Content Intel',
      metrics: [
        { label: 'Your Output (30d)', value: '8 pieces', vs_best: 'Workday: 22' },
        { label: 'Content Gaps', value: '6 topics', vs_best: null },
        { label: 'Format Mix', value: '60% Blog', vs_best: 'Flowcast: 45% Blog, 20% Video' },
      ],
      summary: 'You publish less than half of what Workday and Flowcast produce. Zero video content while Flowcast runs 20% video mix. 6 topic gaps identified where competitors have content and you don\'t.',
    },
    {
      channel: 'Organic / SEO',
      status: 'on_par',
      source_tab: 'Traffic & SEO',
      metrics: [
        { label: 'Organic Traffic', value: '~185k/mo', vs_best: 'BlackLine: ~310k' },
        { label: 'Domain Authority', value: '62', vs_best: 'BlackLine: 71' },
        { label: 'Keyword Gaps', value: '23 keywords', vs_best: null },
      ],
      summary: 'Traffic is mid-pack but 40% behind BlackLine. DA gap of 9 points limits keyword ranking ceiling. Strong in AR-related keywords (#1 for "order to cash process") but zero presence in NetSuite and FP&A clusters.',
    },
    {
      channel: 'Paid Ads',
      status: 'behind',
      source_tab: 'Paid Channels',
      metrics: [
        { label: 'Active Ads', value: '26', vs_best: 'Workday: 81' },
        { label: 'Paid Keywords', value: '1,240', vs_best: 'Workday: 4,200' },
        { label: 'Brand Under Attack', value: '4 terms', vs_best: null },
      ],
      summary: 'BlackLine is ramping up aggressively (+12 ads in 30d). 4 of your brand keywords are under competitor bidding — BlackLine holds position #1 on "highradius alternative." You have zero paid presence in NetSuite and Financial Close themes.',
    },
    {
      channel: 'AI Engines (AEO)',
      status: 'behind',
      source_tab: 'AEO',
      metrics: [
        { label: 'AI Visibility', value: '34%', vs_best: 'Workday: 68%' },
        { label: 'Mention Rate', value: '28%', vs_best: 'BlackLine: 62%' },
        { label: 'Avg Position', value: '#3', vs_best: 'BlackLine: #2' },
      ],
      summary: 'You\'re mentioned in 28% of tracked queries — half of BlackLine\'s rate. Perplexity is your strongest engine but you\'re absent from Copilot entirely. Flowcast is gaining AI visibility fast despite having the smallest domain.',
    },
  ],

  gaps: [
    { priority: 'critical', channel: 'Organic / SEO', description: 'Zero content or ranking for NetSuite integration keywords', owned_by: 'Flowcast (#3), BlackLine (#7)', impact: '2,400+ monthly searches, all going to competitors' },
    { priority: 'critical', channel: 'Paid Ads', description: 'No paid presence in "AI cash application" — your core capability', owned_by: 'Flowcast (#1 in paid)', impact: 'Flowcast is paying to own the AI+AR narrative you should own' },
    { priority: 'critical', channel: 'Paid Ads', description: 'BlackLine bidding #1 on "highradius alternative"', owned_by: 'BlackLine (ad position #1)', impact: 'High-intent brand traffic being intercepted' },
    { priority: 'high', channel: 'Content', description: 'Zero video content while competitors average 15% video mix', owned_by: 'Flowcast (20% video)', impact: 'Video has 2x engagement in B2B finance — missing format entirely' },
    { priority: 'high', channel: 'AI Engines (AEO)', description: 'Not mentioned in "financial close software comparison" across all AI engines', owned_by: 'BlackLine (all engines)', impact: 'Invisible to AI-driven research for a major commercial query' },
    { priority: 'high', channel: 'Organic / SEO', description: 'DA 62 vs BlackLine\'s 71 — limits ranking ceiling for competitive keywords', owned_by: 'BlackLine (DA 71, 8.2K referring domains)', impact: 'Need 2x referring domains to close the gap' },
    { priority: 'high', channel: 'Paid Ads', description: 'No paid ads on LinkedIn for AR automation — Flowcast and BlackLine both active', owned_by: 'BlackLine (14 LinkedIn ads), Flowcast (3)', impact: 'Missing CFO/VP Finance audience on their primary platform' },
    { priority: 'medium', channel: 'Content', description: 'No content presence in mid-market FP&A topics', owned_by: 'Planful (5 pieces)', impact: 'Only relevant if FP&A is in your ICP' },
    { priority: 'medium', channel: 'AI Engines (AEO)', description: 'Zero visibility on Copilot (Microsoft ecosystem)', owned_by: 'BlackLine (mentioned in 60% of Copilot queries)', impact: 'Growing channel — Microsoft enterprise users increasingly use Copilot for research' },
  ],

  cross_channel_insights: [
    {
      channels: ['Paid Ads', 'Content', 'AI Engines (AEO)'],
      inference: 'Flowcast is running a coordinated "AI + AR" campaign across all channels simultaneously — this is a deliberate repositioning play, not organic growth',
      evidence: [
        'Content: 8 AI-focused blog posts in 30 days (3x their historical average)',
        'Paid: 10 ads in "AI Automation" theme across Google Ads + LinkedIn + Meta simultaneously',
        'AEO: AI visibility score growing fastest of all competitors (+42% in 30d)',
        'Messaging shifted from "modern AR" to "autonomous finance" across all channels in the same week',
      ],
      actions: [
        { task: 'Publish a definitive "State of AI in AR" guide — use your patent data and 900+ customer base as proof points Flowcast can\'t match', owner: 'Content Lead', urgency: 'This week' },
        { task: 'Bid on "AI cash application" and "AI accounts receivable" keywords — reclaim paid presence in your core capability', owner: 'Paid Media Manager', urgency: 'This week' },
        { task: 'Add key takeaway summaries to top 10 AR blog posts for AEO optimization', owner: 'SEO Lead', urgency: 'This month' },
      ],
    },
    {
      channels: ['Organic / SEO', 'Paid Ads'],
      inference: 'You rank #1 organically for "order to cash process" (5.5K vol) but run zero paid ads — competitors are capturing 30-40% of clicks above your organic result',
      evidence: [
        'Organic position #1 for "order to cash process" — highest relevance signal possible',
        'BlackLine and Workday run paid ads above your organic result on this query',
        'Google research shows dual presence (ad + organic) increases CTR by 30%+',
        'You\'re winning the SEO game but losing the click to paid intercepts',
      ],
      actions: [
        { task: 'Run defensive paid ads on all keywords where you rank #1-3 organically — even $5-8 CPC bids secure the top slot', owner: 'Paid Media Manager', urgency: 'This week' },
        { task: 'Identify top 5 organic #1 keywords and set up brand defense campaigns', owner: 'SEO Lead', urgency: 'This month' },
      ],
    },
    {
      channels: ['Paid Ads', 'Content', 'Organic / SEO'],
      inference: 'BlackLine is executing a systematic 3-channel brand intercept — they are bidding on your name, building comparison pages, and ranking organically for "vs" keywords',
      evidence: [
        'Paid: BlackLine bids #1 on "highradius alternative" ($8.50 CPC premium)',
        'Content: launched "BlackLine vs HighRadius" comparison page with 12 paid keywords driving traffic',
        'SEO: that comparison page now ranks organically for "highradius vs blackline"',
        'This is a coordinated pincer — paid captures today, organic captures tomorrow',
      ],
      actions: [
        { task: 'Create "HighRadius vs BlackLine" comparison page using Claims Audit data as objective evidence', owner: 'Content Lead', urgency: 'This week' },
        { task: 'Bid on "blackline alternative" and "blackline vs highradius" keywords', owner: 'Paid Media Manager', urgency: 'This week' },
        { task: 'Add sitelink extensions to all brand ads (pricing, demo, reviews, case studies)', owner: 'Paid Media Manager', urgency: 'This month' },
        { task: 'Brief sales team on BlackLine\'s comparison page messaging — update battle cards with counter-points', owner: 'Sales Enablement', urgency: 'This week' },
      ],
    },
    {
      channels: ['Content', 'Organic / SEO'],
      inference: 'Your content is 4x more efficient than Flowcast\'s — don\'t chase their volume, optimize what you have',
      evidence: [
        'Your content-to-traffic ratio: 23K visits per piece (8 pieces → 185K traffic)',
        'Flowcast\'s ratio: 5K visits per piece (16 pieces → 82K traffic)',
        'The gap is DA (62 vs 45) and domain maturity, not content quality',
        'One high-ranking page outperforms 10 low-ranking ones in B2B',
      ],
      actions: [
        { task: 'Refresh and optimize top 10 performing pages for 2026 — update stats, add AEO summaries, improve internal linking', owner: 'Content Lead', urgency: 'This month' },
        { task: 'Launch link-building campaign targeting fintech publications to close DA gap (62 → 70+ target)', owner: 'SEO Lead', urgency: 'This month' },
      ],
    },
    {
      channels: ['Content', 'Paid Ads', 'Organic / SEO', 'AI Engines (AEO)'],
      inference: 'NetSuite integration is a total blind spot — zero presence across ALL four channels while Flowcast has built a moat',
      evidence: [
        'Organic: zero pages targeting NetSuite keywords (2,400+ monthly volume)',
        'Paid: zero ads on "netsuite AR automation"',
        'Content: zero blog posts about NetSuite integration',
        'AEO: Flowcast owns all AI engine mentions for NetSuite queries',
      ],
      actions: [
        { task: 'Create NetSuite integration hub landing page targeting "netsuite AR automation" keyword cluster', owner: 'Content Lead', urgency: 'This week' },
        { task: 'Launch paid ads on "netsuite AR automation" and "netsuite accounts receivable" keywords', owner: 'Paid Media Manager', urgency: 'This month' },
        { task: 'Publish "NetSuite + HighRadius Integration Guide" blog post', owner: 'Content Lead', urgency: 'This month' },
        { task: 'Coordinate cross-channel NetSuite launch — all assets live in the same week for maximum SERP impact', owner: 'Marketing Director', urgency: 'This month' },
      ],
    },
  ],
};

const SAMPLE_META = {
  main_company: { name: 'HighRadius', logo_url: null },
  competitors: [
    { name: 'BlackLine', logo_url: null },
    { name: 'Flowcast', logo_url: null },
    { name: 'Planful', logo_url: null },
    { name: 'Workday', logo_url: null },
    { name: 'OneStream', logo_url: null },
  ],
};


export default function MarketingOverviewPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  const hasRealData = data?.marketing_overview;
  const displayData = hasRealData ? data.marketing_overview : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  if (projectId && loading) {
    return <Spinner text="Loading marketing overview..." subtext="Aggregating data from all channels" />;
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
          <div className="report-error-title">Failed to load marketing overview</div>
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
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>Marketing Intelligence Overview</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Consolidated view across Content, SEO, Paid, and AEO — cross-channel patterns your individual teams can't see
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

      <MarketingOverview data={displayData} meta={displayMeta} />
    </div>
  );
}
