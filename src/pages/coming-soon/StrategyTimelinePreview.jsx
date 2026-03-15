import { LineChart } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const lanes = [
  {
    company: 'CompetitorA',
    events: [
      { label: 'Series C', left: '5%', width: '10%', color: '#2563EB' },
      { label: 'EU Launch', left: '25%', width: '12%', color: '#059669' },
      { label: 'AI Feature', left: '55%', width: '15%', color: '#7C3AED' },
      { label: 'Price Hike', left: '80%', width: '10%', color: '#DC2626' },
    ],
  },
  {
    company: 'CompetitorB',
    events: [
      { label: 'Free Tier', left: '10%', width: '10%', color: '#D97706' },
      { label: 'Mobile App', left: '35%', width: '12%', color: '#2563EB' },
      { label: 'Acquisition', left: '65%', width: '15%', color: '#DC2626' },
    ],
  },
  {
    company: 'CompetitorC',
    events: [
      { label: 'Open Source', left: '8%', width: '12%', color: '#059669' },
      { label: 'API v2', left: '40%', width: '10%', color: '#7C3AED' },
      { label: 'Series B', left: '70%', width: '10%', color: '#2563EB' },
      { label: 'HIPAA Cert', left: '88%', width: '8%', color: '#059669' },
    ],
  },
];

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export default function StrategyTimelinePreview() {
  return (
    <ComingSoonPreview
      title="Strategy Timeline"
      description="Visualize competitor strategic moves on a unified timeline. Spot patterns, correlate events, and anticipate next moves."
      icon={<LineChart size={28} />}
    >
      {/* Month labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0 8px', marginBottom: 8, borderBottom: '1px solid var(--gray-200)' }}>
        {months.map((m, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>{m}</span>
        ))}
      </div>

      {lanes.map((lane, i) => (
        <div className="preview-swimlane" key={i}>
          <div className="preview-swimlane-label">{lane.company}</div>
          <div className="preview-swimlane-track">
            {lane.events.map((e, ei) => (
              <div
                key={ei}
                className="preview-swimlane-event"
                style={{ left: e.left, width: e.width, background: e.color }}
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </ComingSoonPreview>
  );
}
