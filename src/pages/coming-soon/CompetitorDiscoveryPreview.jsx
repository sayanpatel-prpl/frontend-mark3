import { Search } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const tracked = [
  { name: 'CompetitorA', category: 'Direct', reviews: '1,247' },
  { name: 'CompetitorB', category: 'Direct', reviews: '892' },
  { name: 'CompetitorC', category: 'Direct', reviews: '634' },
];

const suggested = [
  { name: 'NewCo AI', relevance: 87, category: 'Emerging', reason: 'Overlapping features, growing fast' },
  { name: 'LegacyCorp', relevance: 72, category: 'Adjacent', reason: 'Same buyer persona, different approach' },
  { name: 'StartupX', relevance: 68, category: 'Emerging', reason: 'YC W26, targeting your segment' },
  { name: 'EnterprisePlus', relevance: 61, category: 'Indirect', reason: 'Bundled offering includes your category' },
];

export default function CompetitorDiscoveryPreview() {
  return (
    <ComingSoonPreview
      title="Competitor Discovery"
      description="AI-powered discovery of new and emerging competitors. Get suggestions based on market overlap, feature similarity, and buyer persona analysis."
      icon={<Search size={28} />}
    >
      <div className="preview-two-col">
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            Currently Tracking
          </div>
          {tracked.map((t, i) => (
            <div className="preview-card" key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{t.reviews} reviews tracked</div>
              </div>
              <span className="preview-badge preview-badge-blue">{t.category}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            Suggested Competitors
          </div>
          {suggested.map((s, i) => (
            <div className="preview-card" key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{s.name}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-accent)' }}>{s.relevance}%</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 4 }}>{s.reason}</div>
              <span className={`preview-badge ${s.category === 'Emerging' ? 'preview-badge-amber' : s.category === 'Adjacent' ? 'preview-badge-purple' : 'preview-badge-blue'}`}>
                {s.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ComingSoonPreview>
  );
}
