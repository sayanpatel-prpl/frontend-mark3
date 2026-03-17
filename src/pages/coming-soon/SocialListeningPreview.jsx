import { Globe } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const mentions = [
  { platform: 'Twitter', author: '@techreviewer', text: 'Just migrated from CompetitorA to this — night and day difference in API quality.', sentiment: 'positive', time: '2h ago' },
  { platform: 'Reddit', author: 'u/saas_buyer', text: 'Anyone compared pricing between the top 3? Looking for honest takes.', sentiment: 'neutral', time: '5h ago' },
  { platform: 'LinkedIn', author: 'VP of Eng @ Acme', text: 'Impressed by the latest release. Finally solves our workflow bottleneck.', sentiment: 'positive', time: '8h ago' },
  { platform: 'Twitter', author: '@devops_daily', text: 'CompetitorB just shipped a feature we\'ve been waiting for. Might switch back.', sentiment: 'negative', time: '1d ago' },
  { platform: 'HackerNews', author: 'anon', text: 'The competitive landscape in this space is heating up. Three solid options now.', sentiment: 'neutral', time: '1d ago' },
];

const sentimentColors = { positive: 'var(--success)', negative: 'var(--danger)', neutral: 'var(--gray-500)' };

export default function SocialListeningPreview() {
  return (
    <ComingSoonPreview
      title="Social Listening"
      description="Monitor mentions of your brand and competitors across social media, forums, and communities. Track share of voice, sentiment shifts, and emerging conversations."
      icon={<Globe size={28} />}
    >
      <DummyStatGrid stats={[
        { label: 'Share of Voice', value: '34%' },
        { label: 'Total Mentions', value: '1.2K' },
        { label: 'Avg Sentiment', value: '+0.6' },
      ]} />

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          Recent Mentions
        </div>
        {mentions.map((m, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="preview-badge preview-badge-blue">{m.platform}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>{m.author}</span>
              <span style={{ fontSize: 10, color: 'var(--gray-400)', marginLeft: 'auto' }}>{m.time}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>{m.text}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: sentimentColors[m.sentiment], marginTop: 4, textTransform: 'uppercase' }}>
              {m.sentiment}
            </div>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
