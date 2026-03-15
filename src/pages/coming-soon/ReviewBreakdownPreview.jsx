import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const competitors = [
  {
    name: 'CompetitorA',
    stats: [
      { label: 'Total Reviews', value: '1,247' },
      { label: 'Avg Rating', value: '4.2' },
      { label: 'NPS Score', value: '38' },
      { label: 'Response Rate', value: '67%' },
    ],
    sentiment: { positive: 64, neutral: 22, negative: 14 },
    quote: '"Great product but onboarding was rocky. Support improved after we escalated."',
  },
  {
    name: 'CompetitorB',
    stats: [
      { label: 'Total Reviews', value: '892' },
      { label: 'Avg Rating', value: '4.5' },
      { label: 'NPS Score', value: '52' },
      { label: 'Response Rate', value: '81%' },
    ],
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    quote: '"Best-in-class UX. Wish they had better enterprise features though."',
  },
  {
    name: 'CompetitorC',
    stats: [
      { label: 'Total Reviews', value: '634' },
      { label: 'Avg Rating', value: '3.8' },
      { label: 'NPS Score', value: '24' },
      { label: 'Response Rate', value: '43%' },
    ],
    sentiment: { positive: 48, neutral: 28, negative: 24 },
    quote: '"Powerful features but steep learning curve. Documentation needs work."',
  },
];

function SentimentBars({ sentiment }) {
  return (
    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ width: `${sentiment.positive}%`, background: 'var(--success)' }} />
      <div style={{ width: `${sentiment.neutral}%`, background: 'var(--warning)' }} />
      <div style={{ width: `${sentiment.negative}%`, background: 'var(--danger)' }} />
    </div>
  );
}

export default function ReviewBreakdownPreview() {
  const [active, setActive] = useState(0);

  return (
    <ComingSoonPreview
      title="Per-Competitor Breakdown"
      description="Deep-dive into each competitor's review landscape. See ratings, sentiment distribution, and representative quotes across all monitored review platforms."
      icon={<ClipboardCheck size={28} />}
    >
      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {competitors.map((c, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1px solid var(--gray-200)',
              background: active === i ? 'var(--brand-accent)' : 'transparent',
              color: active === i ? '#FFFFFF' : 'var(--gray-600)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <DummyStatGrid stats={competitors[active].stats} />

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 4 }}>Sentiment Distribution</div>
        <SentimentBars sentiment={competitors[active].sentiment} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>
          <span>Positive {competitors[active].sentiment.positive}%</span>
          <span>Neutral {competitors[active].sentiment.neutral}%</span>
          <span>Negative {competitors[active].sentiment.negative}%</span>
        </div>
      </div>

      <div className="preview-card" style={{ marginTop: 16 }}>
        <div className="preview-card-title">Representative Quote</div>
        <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--gray-600)' }}>
          {competitors[active].quote}
        </div>
      </div>
    </ComingSoonPreview>
  );
}
