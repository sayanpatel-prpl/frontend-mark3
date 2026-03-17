import { Search } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const mentions = [
  { platform: 'ChatGPT', query: '"best competitive intelligence tools"', mentioned: true, sentiment: 'positive', position: '#2' },
  { platform: 'Perplexity', query: '"competitor analysis software"', mentioned: true, sentiment: 'positive', position: '#1' },
  { platform: 'Google AI', query: '"competitive intelligence platform"', mentioned: false, sentiment: 'n/a', position: 'Not listed' },
  { platform: 'ChatGPT', query: '"alternative to CompetitorA"', mentioned: true, sentiment: 'neutral', position: '#3' },
  { platform: 'Perplexity', query: '"market intelligence tools 2026"', mentioned: true, sentiment: 'positive', position: '#2' },
];

const sentimentBadge = { positive: 'green', neutral: 'amber', 'n/a': 'blue' };

export default function AEOPreview() {
  return (
    <ComingSoonPreview
      title="AI Engine Optimization (AEO)"
      description="Track how AI assistants and search engines reference your brand vs competitors. Optimize your presence in AI-generated answers and recommendations."
      icon={<Search size={28} />}
    >
      <DummyStatGrid stats={[
        { label: 'AI Mention Rate', value: '68%' },
        { label: 'Avg Position', value: '#2.1' },
        { label: 'Queries Tracked', value: '24' },
      ]} />

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          AI Mention Tracking
        </div>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Query</th>
              <th>Mentioned</th>
              <th>Sentiment</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {mentions.map((m, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{m.platform}</td>
                <td style={{ fontSize: 12 }}>{m.query}</td>
                <td>{m.mentioned ? <span className="preview-badge preview-badge-green">Yes</span> : <span className="preview-badge preview-badge-red">No</span>}</td>
                <td><span className={`preview-badge preview-badge-${sentimentBadge[m.sentiment]}`}>{m.sentiment}</span></td>
                <td style={{ fontWeight: 600 }}>{m.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
