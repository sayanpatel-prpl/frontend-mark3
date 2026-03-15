import { FileText } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const competitors = [
  {
    name: 'CompetitorA',
    postsPerMonth: 12,
    topics: ['Product Updates', 'Case Studies', 'Engineering'],
    mix: { blog: 50, video: 20, podcast: 10, whitepaper: 20 },
  },
  {
    name: 'CompetitorB',
    postsPerMonth: 8,
    topics: ['How-To Guides', 'Industry Trends', 'Templates'],
    mix: { blog: 70, video: 15, podcast: 0, whitepaper: 15 },
  },
  {
    name: 'CompetitorC',
    postsPerMonth: 4,
    topics: ['Technical Docs', 'API Updates', 'Community'],
    mix: { blog: 40, video: 5, podcast: 0, whitepaper: 55 },
  },
];

const mixColors = { blog: '#2563EB', video: '#DC2626', podcast: '#D97706', whitepaper: '#059669' };

export default function ContentIntelPreview() {
  return (
    <ComingSoonPreview
      title="Content & Blog Intelligence"
      description="Analyze competitor content strategies. Track publishing frequency, topic focus, and content mix to identify gaps in your own content calendar."
      icon={<FileText size={28} />}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {competitors.map((c, i) => (
          <div className="preview-card" key={i}>
            <div className="preview-card-title">{c.name}</div>
            <DummyStatGrid stats={[{ label: 'Posts / Month', value: String(c.postsPerMonth) }]} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {c.topics.map((t, ti) => (
                <span key={ti} className="preview-badge preview-badge-blue">{t}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 4 }}>Content Mix</div>
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              {Object.entries(c.mix).filter(([, v]) => v > 0).map(([k, v]) => (
                <div key={k} style={{ width: `${v}%`, background: mixColors[k] }} title={`${k}: ${v}%`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {Object.entries(c.mix).filter(([, v]) => v > 0).map(([k, v]) => (
                <span key={k} style={{ fontSize: 9, color: 'var(--gray-400)' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: mixColors[k], marginRight: 3 }} />
                  {k} {v}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
