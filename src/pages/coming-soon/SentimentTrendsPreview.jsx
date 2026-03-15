import { TrendingUp } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyLineChart from '../../components/coming-soon/DummyLineChart';

const lines = [
  { label: 'Your Company', color: '#C9A84C', data: [42, 45, 44, 48, 51, 54] },
  { label: 'CompetitorA', color: '#2563EB', data: [38, 37, 40, 39, 38, 36] },
  { label: 'CompetitorB', color: '#059669', data: [52, 50, 49, 51, 53, 52] },
];

const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const trends = [
  { name: 'Your Company', direction: 'up', change: '+12', color: 'var(--success)' },
  { name: 'CompetitorA', direction: 'down', change: '-2', color: 'var(--danger)' },
  { name: 'CompetitorB', direction: 'flat', change: '0', color: 'var(--gray-500)' },
];

export default function SentimentTrendsPreview() {
  return (
    <ComingSoonPreview
      title="Sentiment Trends & NPS"
      description="Track how customer sentiment evolves over time across all competitors. Spot trend inflections before they become visible in aggregate scores."
      icon={<TrendingUp size={28} />}
    >
      <DummyLineChart lines={lines} labels={labels} />

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {trends.map((t, i) => (
          <div className="preview-card" key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{t.name}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.color, marginTop: 4 }}>
              {t.direction === 'up' ? '↑' : t.direction === 'down' ? '↓' : '→'} {t.change}
            </div>
            <div style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: 2 }}>
              6-month trend
            </div>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
