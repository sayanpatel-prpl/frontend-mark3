import { PenTool } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const rows = [
  { field: 'Tagline', you: '"Intelligence that competes"', a: '"Scale without limits"', b: '"Simple tools for growing teams"', c: '"Build better, ship faster"' },
  { field: 'Target Persona', you: 'CI & Product Marketing', a: 'CTO / Engineering leads', b: 'SMB founders & ops', c: 'Developer teams' },
  { field: 'Value Prop', you: 'AI-powered competitive insights', a: 'Enterprise reliability at scale', b: 'Free to start, easy to grow', c: 'API-first, extensible platform' },
  { field: 'Differentiator', you: 'Real-time signal aggregation', a: '99.99% uptime SLA', b: 'Generous free tier', c: 'Open-source core' },
];

export default function PositioningPreview() {
  return (
    <ComingSoonPreview
      title="Positioning & Messaging"
      description="Compare how competitors position themselves in the market. Track tagline changes, value propositions, and target persona shifts over time."
      icon={<PenTool size={28} />}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="preview-table">
          <thead>
            <tr>
              <th></th>
              <th>Your Company</th>
              <th>CompetitorA</th>
              <th>CompetitorB</th>
              <th>CompetitorC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{r.field}</td>
                <td style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{r.you}</td>
                <td>{r.a}</td>
                <td>{r.b}</td>
                <td>{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
