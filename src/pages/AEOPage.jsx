import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import AEOIntel from '../components/feature-report/AEOIntel';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw, Search } from 'lucide-react';

/* ─── Sample data modeled on Otterly AI data shape ─── */
const SAMPLE_DATA = {
  tracked_engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'],

  scorecard: {
    visibility_score: '34%',
    mention_rate: '28%',
    avg_position: '#3',
    queries_tracked: 48,
    top_engine: 'Perplexity',
  },

  platforms: [
    { name: 'Perplexity', visibility: 42, mentions: 18, avg_position: 2, trend: 'growing' },
    { name: 'ChatGPT', visibility: 36, mentions: 14, avg_position: 3, trend: 'steady' },
    { name: 'Google AIO', visibility: 31, mentions: 12, avg_position: 4, trend: 'growing' },
    { name: 'Gemini', visibility: 28, mentions: 9, avg_position: 4, trend: 'steady' },
    { name: 'Copilot', visibility: 22, mentions: 7, avg_position: 5, trend: 'declining' },
  ],

  share_of_voice: [
    { name: 'BlackLine', mention_rate: 62, avg_position: 2, is_you: false },
    { name: 'Workday', mention_rate: 58, avg_position: 2, is_you: false },
    { name: 'HighRadius', mention_rate: 34, avg_position: 3, is_you: true },
    { name: 'Planful', mention_rate: 31, avg_position: 4, is_you: false },
    { name: 'OneStream', mention_rate: 26, avg_position: 4, is_you: false },
    { name: 'Flowcast', mention_rate: 18, avg_position: 5, is_you: false },
  ],

  visibility_trend: {
    '30d': [
      { label: 'Feb 20', value: 28 }, { label: 'Feb 23', value: 30 }, { label: 'Feb 26', value: 29 },
      { label: 'Mar 1', value: 32 }, { label: 'Mar 4', value: 31 }, { label: 'Mar 7', value: 33 },
      { label: 'Mar 10', value: 34 }, { label: 'Mar 13', value: 32 }, { label: 'Mar 16', value: 35 },
      { label: 'Mar 19', value: 34 },
    ],
    '90d': [
      { label: 'Dec', value: 22 }, { label: 'Jan W1', value: 24 }, { label: 'Jan W2', value: 23 },
      { label: 'Jan W3', value: 26 }, { label: 'Jan W4', value: 25 }, { label: 'Feb W1', value: 28 },
      { label: 'Feb W2', value: 27 }, { label: 'Feb W3', value: 30 }, { label: 'Feb W4', value: 29 },
      { label: 'Mar W1', value: 32 }, { label: 'Mar W2', value: 34 }, { label: 'Mar W3', value: 34 },
    ],
    '180d': [
      { label: 'Sep', value: 15 }, { label: 'Oct', value: 18 }, { label: 'Nov', value: 20 },
      { label: 'Dec', value: 22 }, { label: 'Jan', value: 26 }, { label: 'Feb', value: 29 },
      { label: 'Mar', value: 34 },
    ],
  },

  queries: [
    {
      query: 'best accounts receivable automation software',
      intent: 'commercial',
      sentiment: 'positive',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 3 },
        'Perplexity': { you_mentioned: true, you_position: 2 },
        'Gemini': { you_mentioned: true, you_position: 4 },
        'Google AIO': { you_mentioned: true, you_position: 3 },
        'Copilot': { you_mentioned: false },
      },
      competitors_in_answer: [
        { name: 'BlackLine', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'], position: 1 },
        { name: 'Workday', engines: ['ChatGPT', 'Perplexity', 'Gemini'], position: 2 },
        { name: 'Flowcast', engines: ['Perplexity', 'Copilot'], position: 5 },
      ],
    },
    {
      query: 'what is cash application in accounts receivable',
      intent: 'informational',
      sentiment: 'positive',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 1 },
        'Perplexity': { you_mentioned: true, you_position: 1 },
        'Gemini': { you_mentioned: true, you_position: 2 },
        'Google AIO': { you_mentioned: true, you_position: 1 },
        'Copilot': { you_mentioned: true, you_position: 2 },
      },
      competitors_in_answer: [
        { name: 'BlackLine', engines: ['Gemini', 'Copilot'], position: 3 },
      ],
    },
    {
      query: 'HighRadius vs BlackLine comparison',
      intent: 'navigational',
      sentiment: 'mixed',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 1 },
        'Perplexity': { you_mentioned: true, you_position: 1 },
        'Gemini': { you_mentioned: true, you_position: 2 },
        'Google AIO': { you_mentioned: false },
        'Copilot': { you_mentioned: true, you_position: 1 },
      },
      competitors_in_answer: [
        { name: 'BlackLine', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Copilot'], position: 1 },
      ],
    },
    {
      query: 'best FP&A software for mid market',
      intent: 'commercial',
      sentiment: 'neutral',
      engines: {
        'ChatGPT': { you_mentioned: false },
        'Perplexity': { you_mentioned: false },
        'Gemini': { you_mentioned: false },
        'Google AIO': { you_mentioned: false },
        'Copilot': { you_mentioned: false },
      },
      competitors_in_answer: [
        { name: 'Planful', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'], position: 1 },
        { name: 'Workday', engines: ['ChatGPT', 'Perplexity', 'Gemini'], position: 2 },
        { name: 'OneStream', engines: ['Perplexity'], position: 4 },
      ],
    },
    {
      query: 'how to reduce DSO days sales outstanding',
      intent: 'informational',
      sentiment: 'positive',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 2 },
        'Perplexity': { you_mentioned: true, you_position: 1 },
        'Gemini': { you_mentioned: false },
        'Google AIO': { you_mentioned: true, you_position: 3 },
        'Copilot': { you_mentioned: false },
      },
      competitors_in_answer: [
        { name: 'BlackLine', engines: ['ChatGPT', 'Gemini'], position: 4 },
        { name: 'Flowcast', engines: ['Perplexity'], position: 3 },
      ],
    },
    {
      query: 'financial close automation software comparison',
      intent: 'commercial',
      sentiment: 'neutral',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 4 },
        'Perplexity': { you_mentioned: false },
        'Gemini': { you_mentioned: false },
        'Google AIO': { you_mentioned: false },
        'Copilot': { you_mentioned: false },
      },
      competitors_in_answer: [
        { name: 'BlackLine', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'], position: 1 },
        { name: 'OneStream', engines: ['ChatGPT', 'Perplexity', 'Gemini'], position: 2 },
        { name: 'Workday', engines: ['Perplexity', 'Google AIO'], position: 3 },
      ],
    },
    {
      query: 'AI-powered invoice processing',
      intent: 'commercial',
      sentiment: 'positive',
      engines: {
        'ChatGPT': { you_mentioned: true, you_position: 2 },
        'Perplexity': { you_mentioned: true, you_position: 1 },
        'Gemini': { you_mentioned: true, you_position: 3 },
        'Google AIO': { you_mentioned: true, you_position: 2 },
        'Copilot': { you_mentioned: true, you_position: 2 },
      },
      competitors_in_answer: [
        { name: 'Workday', engines: ['ChatGPT', 'Gemini'], position: 1 },
        { name: 'BlackLine', engines: ['Copilot'], position: 4 },
      ],
    },
    {
      query: 'enterprise financial consolidation platform',
      intent: 'commercial',
      sentiment: 'neutral',
      engines: {
        'ChatGPT': { you_mentioned: false },
        'Perplexity': { you_mentioned: false },
        'Gemini': { you_mentioned: false },
        'Google AIO': { you_mentioned: false },
        'Copilot': { you_mentioned: false },
      },
      competitors_in_answer: [
        { name: 'Workday', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'], position: 1 },
        { name: 'OneStream', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Copilot'], position: 2 },
        { name: 'BlackLine', engines: ['Perplexity', 'Google AIO'], position: 3 },
      ],
    },
  ],

  top_cited_pages: [
    { company: 'BlackLine', title: 'What Is Financial Close Management?', path: '/resources/financial-close', citations: 34, engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO'], is_you: false },
    { company: 'HighRadius', title: 'Cash Application: Complete Guide', path: '/resources/cash-application-guide', citations: 28, engines: ['ChatGPT', 'Perplexity', 'Google AIO'], is_you: true },
    { company: 'Workday', title: 'Enterprise Financial Management', path: '/products/financial-management', citations: 26, engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Copilot'], is_you: false },
    { company: 'HighRadius', title: 'What Is Accounts Receivable?', path: '/resources/accounts-receivable', citations: 22, engines: ['Perplexity', 'Google AIO', 'Gemini'], is_you: true },
    { company: 'Planful', title: 'FP&A Software for Growing Companies', path: '/solutions/fpa', citations: 19, engines: ['ChatGPT', 'Perplexity'], is_you: false },
    { company: 'OneStream', title: 'Unified Financial Close Platform', path: '/solutions/close', citations: 16, engines: ['Perplexity', 'Gemini'], is_you: false },
    { company: 'Flowcast', title: 'AI-Powered Cash Application Guide', path: '/blog/ai-cash-application', citations: 14, engines: ['Perplexity'], is_you: false },
    { company: 'HighRadius', title: 'Order to Cash Process Explained', path: '/resources/order-to-cash', citations: 12, engines: ['ChatGPT', 'Perplexity'], is_you: true },
  ],

  visibility_gaps: [
    {
      query: 'best FP&A software for mid market',
      severity: 'critical',
      competitors: [
        { name: 'Planful', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'] },
        { name: 'Workday', engines: ['ChatGPT', 'Perplexity', 'Gemini'] },
        { name: 'OneStream', engines: ['Perplexity'] },
      ],
      recommendation: 'You are invisible for FP&A queries across all AI engines. Create a comprehensive FP&A comparison page and optimize existing content with structured Q&A format — this is what AI engines prefer for citation.',
    },
    {
      query: 'enterprise financial consolidation platform',
      severity: 'critical',
      competitors: [
        { name: 'Workday', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'] },
        { name: 'OneStream', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Copilot'] },
        { name: 'BlackLine', engines: ['Perplexity', 'Google AIO'] },
      ],
      recommendation: 'Workday and OneStream dominate consolidation queries. Build an enterprise consolidation guide with named customer examples and structured data (tables, comparison charts) — these get cited more by LLMs.',
    },
    {
      query: 'financial close automation software comparison',
      severity: 'high',
      competitors: [
        { name: 'BlackLine', engines: ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO', 'Copilot'] },
        { name: 'OneStream', engines: ['ChatGPT', 'Perplexity', 'Gemini'] },
      ],
      recommendation: 'You appear in ChatGPT (#4) but are absent from Perplexity, Gemini, and Google AIO. Optimize your comparison page with FAQ schema and direct answers to common buyer questions.',
    },
  ],

  recommendations: [
    {
      priority: 'high',
      type: 'Content Structure',
      category: 'aeo',
      observation: 'Your top-cited pages use long-form narrative content. AI engines strongly prefer Q&A-structured content with clear headings, tables, and direct answers.',
      implication: 'Pages structured as Q&A with FAQ schema get 3x more AI citations than narrative-format pages. Your competitors are already adopting this format.',
      action: 'Restructure your top 5 resource pages into Q&A format with H2 headings as questions, direct answer in the first paragraph, then supporting detail. Add FAQ schema markup. This is the #1 AEO lever.',
    },
    {
      priority: 'high',
      type: 'Platform Gap',
      category: 'aeo',
      observation: 'Copilot visibility (22%) is significantly lower than other engines. BlackLine appears in Copilot for 80% of tracked queries vs your 28%.',
      implication: 'Copilot is growing fastest in enterprise B2B search. Low visibility here means you are missing a key buying audience.',
      action: 'Ensure your key pages are indexed by Bing Webmaster Tools. Submit an llms.txt file to guide AI crawlers on your site structure. Copilot pulls heavily from Bing-indexed content.',
    },
    {
      priority: 'medium',
      type: 'Reddit/Quora Optimization',
      category: 'content',
      observation: 'Perplexity and ChatGPT pull heavily from Reddit and Quora discussions. Competitors are actively engaging on these platforms — Flowcast has 15+ Quora answers mentioning their product.',
      implication: 'Reddit and Quora are primary training data sources for LLMs. Absence from these platforms means absence from AI answers.',
      action: 'Start a systematic Quora/Reddit presence: answer 3-5 questions per week on AR automation, DSO reduction, and financial close topics. Reference your guides naturally.',
    },
    {
      priority: 'medium',
      type: 'Citation Authority',
      category: 'content',
      observation: 'BlackLine\'s financial close management page gets 34 citations vs your best page at 28. Their page has structured comparison tables and named customer logos.',
      implication: 'LLMs cite pages with specific data points, comparison tables, and named proof more than generic marketing copy.',
      action: 'Add comparison tables and customer proof points to your top 3 resource pages. Include specific metrics ("reduced DSO by 40%") — LLMs cite specific claims more than generic statements.',
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


export default function AEOPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  const hasRealData = data?.aeo;
  const displayData = hasRealData ? data.aeo : SAMPLE_DATA;
  const displayMeta = hasRealData ? data.meta : SAMPLE_META;
  const showSample = !hasRealData;

  if (projectId && loading) {
    return <Spinner text="Loading AEO intelligence..." subtext="Checking for cached report data" />;
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
          <div className="report-error-title">Failed to load AEO intelligence</div>
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
            <Search size={24} style={{ color: 'var(--azure)' }} />
            <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 0 }}>AI Engine Optimization (AEO)</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Track how AI assistants reference your brand vs competitors across ChatGPT, Perplexity, Gemini, and Google AI Overview
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

      <AEOIntel data={displayData} meta={displayMeta} />
    </div>
  );
}
