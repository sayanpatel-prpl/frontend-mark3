import { TrendingUp } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const insights = [
  {
    category: 'Market Shift',
    text: 'CompetitorA and CompetitorB both hired Head of AI roles in the past 60 days. Combined with 3 AI-related blog posts, the market is converging on AI-powered features as table stakes.',
    confidence: 'High',
    confColor: 'green',
  },
  {
    category: 'Pricing Risk',
    text: 'CompetitorB\'s free tier is capturing 40% more signups than 6 months ago. Your trial conversion rate may be impacted if the trend continues.',
    confidence: 'Medium',
    confColor: 'amber',
  },
  {
    category: 'Opportunity',
    text: 'CompetitorC has accumulated 15 negative reviews about customer support in the past quarter. Their CSAT score dropped below 3.5. This is an acquisition opportunity.',
    confidence: 'High',
    confColor: 'green',
  },
  {
    category: 'Competitive Move',
    text: 'CompetitorA\'s partnership with Salesforce positions them as the default CI tool in the Salesforce ecosystem. Consider accelerating your own CRM integrations.',
    confidence: 'Medium',
    confColor: 'amber',
  },
];

const actions = [
  'Accelerate AI feature development — market expects it by Q3',
  'Launch a competitive migration program targeting CompetitorC churners',
  'Prioritize Salesforce and HubSpot integrations to counter CompetitorA\'s ecosystem play',
];

export default function StrategicInsightsPreview() {
  return (
    <ComingSoonPreview
      title="Strategic Insights"
      description="AI-synthesized strategic insights from all competitive signals. Cross-references hiring, pricing, reviews, and news to surface non-obvious patterns."
      icon={<TrendingUp size={28} />}
    >
      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        {insights.map((ins, i) => (
          <div className="preview-card" key={i}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="preview-badge preview-badge-purple">{ins.category}</span>
              <span className={`preview-badge preview-badge-${ins.confColor}`}>{ins.confidence} Confidence</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6 }}>{ins.text}</div>
          </div>
        ))}
      </div>

      <div className="preview-card" style={{ borderLeft: '3px solid var(--brand-accent)' }}>
        <div className="preview-card-title" style={{ color: 'var(--brand-accent)' }}>Recommended Actions</div>
        {actions.map((a, i) => (
          <div className="preview-card-item" key={i}>
            <span style={{ fontWeight: 600, color: 'var(--brand-accent)', marginRight: 8 }}>{i + 1}.</span>
            {a}
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
