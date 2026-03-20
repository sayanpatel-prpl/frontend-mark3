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
      type: 'Coordinated Campaign',
      channels: ['Paid Ads', 'Content', 'AI Engines (AEO)'],
      pattern: 'Flowcast is running a coordinated "AI + AR" campaign across all channels simultaneously',
      evidence: 'Content: 8 AI-focused blog posts in 30 days (3x their average). Paid: 10 ads in "AI Automation" theme across Google + LinkedIn + Meta. AEO: AI visibility growing fastest of all competitors. This is not organic growth — it\'s a deliberate positioning play to own "AI in finance."',
      recommendation: 'Launch a counter-campaign within 2 weeks. Publish a definitive "State of AI in AR" guide (content), bid on "AI cash application" keywords (paid), and optimize existing AI content for AEO readability (key takeaways format). Use your patent data and 900+ customer base as evidence Flowcast can\'t match.',
    },
    {
      type: 'Organic-Paid Disconnect',
      channels: ['Organic / SEO', 'Paid Ads'],
      pattern: 'You rank #1 organically for "order to cash process" (5.5K vol) but run zero paid ads — leaving the SERP top slot to competitors',
      evidence: 'Organic position #1 proves high relevance. But BlackLine and Workday run ads above your organic result, capturing 30-40% of clicks before users reach your organic listing. You\'re winning organically but losing the click.',
      recommendation: 'Run defensive paid ads on keywords where you already rank #1-3 organically. Even a small bid ($5-8 CPC) ensures you own both the ad slot AND the organic slot, which increases CTR by 30%+ (per Google\'s own research).',
    },
    {
      type: 'Brand Intercept Strategy',
      channels: ['Paid Ads', 'Content', 'Organic / SEO'],
      pattern: 'BlackLine is executing a systematic brand intercept: paid ads on your brand keywords + a comparison landing page + organic SEO targeting "highradius vs blackline"',
      evidence: 'Paid: bidding #1 on "highradius alternative" and "highradius pricing." Content: launched a dedicated "BlackLine vs HighRadius" comparison page (12 keywords driving paid traffic). SEO: that comparison page now ranks organically too. This is a 3-channel pincer move.',
      recommendation: 'Create your own "HighRadius vs BlackLine" comparison page using your Claims Audit data as evidence. Bid on "blackline alternative" and "blackline vs highradius." Ensure your brand ads have sitelink extensions covering pricing, demo, and reviews. The goal: anyone searching for the comparison should land on YOUR page first.',
    },
    {
      type: 'Efficiency Insight',
      channels: ['Content', 'Organic / SEO'],
      pattern: 'Flowcast publishes 2x your content (16 vs 8 pieces/30d) but has less than half your organic traffic (82K vs 185K) — their content is less efficient than yours',
      evidence: 'Your content-to-traffic ratio is 23K visits per piece. Flowcast\'s is 5K visits per piece. Your existing content library is working harder per piece. The gap isn\'t content quality — it\'s DA (62 vs 45) and domain maturity.',
      recommendation: 'Don\'t chase Flowcast\'s publishing volume. Instead, double down on what works: update and optimize your top 10 performing pages (refresh for 2026, add AEO-optimized summaries), and invest in link building to grow DA. One high-ranking page outperforms 10 low-ranking ones.',
    },
    {
      type: 'Channel Gap',
      channels: ['Content', 'Paid Ads'],
      pattern: 'NetSuite integration is a blind spot across ALL channels — zero organic content, zero paid ads, zero SEO ranking',
      evidence: 'Organic: no pages targeting NetSuite keywords. Paid: no ads on "netsuite AR automation." Content: no blog posts about NetSuite integration. AEO: Flowcast owns all AI engine mentions for NetSuite queries. Flowcast has built a moat in this segment across every channel.',
      recommendation: 'If NetSuite mid-market is in your ICP, this needs a cross-channel launch: create a NetSuite integration hub page (organic), run paid ads on "netsuite AR automation" (paid), publish a "NetSuite + HighRadius" integration guide (content). Coordinate launch across all channels in the same week for maximum impact.',
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
